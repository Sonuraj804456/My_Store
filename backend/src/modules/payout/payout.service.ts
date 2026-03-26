import { ApiError } from "../shared/api-error";
import { payoutDb, payouts } from "./payout.db";
import { env } from "../../config/env";
import { db } from "../../config/db";
import { orders } from "../orders/order.db";
import { eq } from "drizzle-orm";

const COMMISSION_PERCENT = Number(env.PLATFORM_COMMISSION_PERCENT ?? 10);
const HOLD_DAYS = Number(env.PAYOUT_HOLD_DAYS ?? 7);

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateForGross(gross: number) {
  const commission = roundMoney((gross * COMMISSION_PERCENT) / 100);
  const net = roundMoney(gross - commission);
  return { commission, net };
}

type Payout = {
  id: string;
  storeId: string;
  creatorId: string;
  orderId: string;
  grossAmount: number | string;
  commissionAmount: number | string;
  netAmount: number | string;
  status: "LOCKED" | "ELIGIBLE" | "RELEASED" | "CANCELLED";
  eligibleAt: string | Date;
  releasedAt?: string | Date | null;
};

type PayoutSummary = {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
  lockedAmount: number;
  eligibleAmount: number;
  releasedAmount: number;
};

async function refreshEligibility(payout: Payout): Promise<Payout | null> {
  if (payout.status !== "LOCKED") return payout;

  const now = new Date();
  if (now >= new Date(payout.eligibleAt)) {
    await payoutDb.update(payout.id, { status: "ELIGIBLE" });
    const updated = await payoutDb.findById(payout.id);
    if (!updated) return null;
    return updated as Payout;
  }

  return payout;
}

export const payoutService = {
  async createPayoutForOrder(order: any) {
    if (!order || !order.id || !order.totalAmount || !order.storeId) {
      throw new ApiError(400, "Missing order data for payout creation");
    }

    const existing = await payoutDb.findByOrderId(order.id);
    if (existing) return existing;

    const grossAmount = Number(order.totalAmount);
    if (isNaN(grossAmount) || grossAmount < 0) {
      throw new ApiError(400, "Invalid order total amount");
    }

    const { commission, net } = calculateForGross(grossAmount);
    const eligibleAt = new Date(Date.now() + HOLD_DAYS * 24 * 60 * 60 * 1000);

    const created = await payoutDb.create({
      storeId: order.storeId,
      creatorId: order.storeId || "",
      orderId: order.id,
      grossAmount,
      commissionAmount: commission,
      netAmount: net,
      status: "LOCKED",
      eligibleAt,
    });

    return created[0];
  },

  async getPayoutsForCreator(userId: string, filters: any = {}) {
    if (!userId) {
      throw new ApiError(400, "Missing creator id");
    }

    const all = (await payoutDb.listByCreator(userId)) as Payout[];
    const enrichedWithNull = await Promise.all(all.map((p: Payout) => refreshEligibility(p)));
    const enriched = enrichedWithNull.filter((p): p is Payout => p !== null);

    if (filters.status) {
      return enriched.filter((p) => p.status === filters.status);
    }

    return enriched;
  },

  async getPayoutSummaryForCreator(userId: string) {
    const payouts = (await this.getPayoutsForCreator(userId)) as Payout[];

    const summary = payouts.reduce(
      (acc: PayoutSummary, p: Payout) => {
        acc.totalGross += Number(p.grossAmount);
        acc.totalCommission += Number(p.commissionAmount);
        acc.totalNet += Number(p.netAmount);
        if (p.status === "LOCKED") acc.lockedAmount += Number(p.netAmount);
        if (p.status === "ELIGIBLE") acc.eligibleAmount += Number(p.netAmount);
        if (p.status === "RELEASED") acc.releasedAmount += Number(p.netAmount);
        return acc;
      },
      {
        totalGross: 0,
        totalCommission: 0,
        totalNet: 0,
        lockedAmount: 0,
        eligibleAmount: 0,
        releasedAmount: 0,
      }
    );

    Object.entries(summary).forEach(([k, v]) => {
      (summary as any)[k] = roundMoney(Number(v));
    });

    return summary;
  },

  async listAll(filters: any = {}) {
    const all = (await payoutDb.listAll()) as Payout[];
    const enrichedWithNull = await Promise.all(all.map((p: Payout) => refreshEligibility(p)));
    const enriched = enrichedWithNull.filter((p): p is Payout => p !== null);

    if (filters.status) {
      return enriched.filter((p) => p.status === filters.status);
    }

    return enriched;
  },

  async releasePayout(payoutId: string) {
    const payout = await payoutDb.findById(payoutId);
    if (!payout) throw new ApiError(404, "Payout not found");

    if (payout.status === "RELEASED") {
      throw new ApiError(400, "Payout already released");
    }

    if (payout.status !== "ELIGIBLE") {
      throw new ApiError(400, "Only eligible payouts can be released");
    }

    await payoutDb.update(payoutId, {
      status: "RELEASED",
      releasedAt: new Date(),
    });

    return payoutDb.findById(payoutId);
  },

  async cancelPayout(payoutId: string) {
    const payout = await payoutDb.findById(payoutId);
    if (!payout) throw new ApiError(404, "Payout not found");

    if (payout.status === "RELEASED") {
      throw new ApiError(400, "Released payout cannot be cancelled");
    }

    if (payout.status === "CANCELLED") return payout;

    await payoutDb.update(payoutId, {
      status: "CANCELLED",
    });

    return payoutDb.findById(payoutId);
  },

  async cancelByOrderId(orderId: string) {
    const payout = await payoutDb.findByOrderId(orderId);
    if (!payout) return null;
    return this.cancelPayout(payout.id);
  },

  async applyRefund(order: any, refundAmount: number) {
    if (!order || !order.id) throw new ApiError(400, "Missing order for refund adjustment");

    if (refundAmount < 0) throw new ApiError(400, "Refund amount must be positive");
    if (refundAmount > Number(order.totalAmount)) throw new ApiError(400, "Refund exceeds order total");

    const payout = await payoutDb.findByOrderId(order.id);
    if (!payout) return null;

    if (payout.status === "RELEASED") {
      return payout; // no payout adjustment after release
    }

    const newGross = Number(order.totalAmount) - refundAmount;
    if (newGross < 0) throw new ApiError(400, "Refund exceeds order total");

    const { commission, net } = calculateForGross(newGross);

    const newStatus = newGross === 0 ? "CANCELLED" : payout.status;

    await payoutDb.update(payout.id, {
      grossAmount: newGross,
      commissionAmount: commission,
      netAmount: net,
      status: newStatus,
    });

    const updated = await payoutDb.findById(payout.id);
    if (updated) return updated;

    return {
      ...payout,
      grossAmount: newGross,
      commissionAmount: commission,
      netAmount: net,
      status: newStatus,
    } as Payout;
  },

  async notifyOrderDelivered(orderId: string) {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    if (!order) throw new ApiError(404, "Order not found");

    const payout = await payoutDb.findByOrderId(orderId);
    if (payout) return payout;

    return this.createPayoutForOrder(order);
  },
};
