import { describe, it, expect, beforeEach, vi } from "vitest";
import { payoutService } from "../src/modules/payout/payout.service";
import { payoutDb } from "../src/modules/payout/payout.db";
import { ApiError } from "../src/modules/shared/api-error";

vi.mock("../src/modules/payout/payout.db", () => ({
  payoutDb: {
    findByOrderId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    listByCreator: vi.fn(),
    listAll: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Payout Service", () => {
  it("should create payout on delivered order", async () => {
    const order = { id: "o1", totalAmount: 100, storeId: "s1" };

    (payoutDb.findByOrderId as any).mockResolvedValue(null);
    (payoutDb.create as any).mockResolvedValue([
      {
        id: "p1",
        orderId: "o1",
        status: "LOCKED",
        grossAmount: 100,
      },
    ]);

    const result = await payoutService.createPayoutForOrder(order);

    expect(result).toEqual(
      expect.objectContaining({ orderId: "o1", status: "LOCKED" })
    );
    expect(payoutDb.create).toHaveBeenCalled();
  });

  it("should reject creating duplicate payout", async () => {
    const order = { id: "o1", totalAmount: 100, storeId: "s1" };
    (payoutDb.findByOrderId as any).mockResolvedValue({ id: "p1" });

    const result = await payoutService.createPayoutForOrder(order);

    expect(result).toEqual({ id: "p1" });
  });

  it("should adjust payout on partial refund", async () => {
    const order = { id: "o1", totalAmount: 100 };
    (payoutDb.findByOrderId as any).mockResolvedValue({ id: "p1", status: "LOCKED" });
    (payoutDb.update as any).mockResolvedValue([{ id: "p1", status: "LOCKED", grossAmount: 50 }]);

    const result = await payoutService.applyRefund(order as any, 50);
    expect(payoutDb.update).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: "p1" }));
  });

  it("should cancel payout when full refund", async () => {
    const order = { id: "o1", totalAmount: 100 };
    (payoutDb.findByOrderId as any).mockResolvedValue({ id: "p1", status: "LOCKED" });
    (payoutDb.update as any).mockResolvedValue([{ id: "p1", status: "CANCELLED" }]);

    const result = await payoutService.applyRefund(order as any, 100);
    expect(payoutDb.update).toHaveBeenCalledWith("p1", expect.objectContaining({ status: "CANCELLED" }));
    expect(result).toEqual(expect.objectContaining({ status: "CANCELLED" }));
  });

  it("should prevent release of non-eligible payout", async () => {
    (payoutDb.findById as any).mockResolvedValue({ id: "p1", status: "LOCKED" });
    await expect(payoutService.releasePayout("p1")).rejects.toThrow(ApiError);
  });
});
