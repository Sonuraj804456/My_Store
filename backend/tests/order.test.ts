import { describe, it, expect, beforeEach, vi } from "vitest";
import { db } from "../src/config/db";
import { orderDb } from "../src/modules/orders/order.db";
import { orderService } from "../src/modules/orders/order.service";
import { payoutService } from "../src/modules/payout/payout.service";
import { downloadService } from "../src/modules/download/download.service";
import { ApiError } from "../src/modules/shared/api-error";



/* ================= MOCKS ================= */

vi.mock("../src/config/db", () => ({
  db: {
    query: {
      products: { findFirst: vi.fn() },
      productVariants: { findFirst: vi.fn() },
      stores: { findFirst: vi.fn() },
    },
  },
}));

vi.mock("../src/modules/orders/order.db", () => ({
  orderDb: {
    findBuyer: vi.fn(),
    findBuyerById: vi.fn(),
    createBuyer: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
    updateRefund: vi.fn(),
    softDelete: vi.fn(),
    listByStore: vi.fn(),
    listAll: vi.fn(),
  },
}));

vi.mock("../src/modules/download/download.service", () => ({
  downloadService: {
    createDigitalDownload: vi.fn(),
    listByProduct: vi.fn(),
    listAll: vi.fn(),
    resolveToken: vi.fn(),
  },
}));

vi.mock("../src/modules/payout/payout.service", () => ({
  payoutService: {
    createPayoutForOrder: vi.fn(),
    cancelByOrderId: vi.fn(),
    applyRefund: vi.fn(),
    releasePayout: vi.fn(),
    cancelPayout: vi.fn(),
    getPayoutsForCreator: vi.fn(),
    getPayoutSummaryForCreator: vi.fn(),
    listAll: vi.fn(),
  },
}));

vi.mock("../src/modules/jobs/job.db", () => ({
  jobDb: {
    create: vi.fn(),
    findById: vi.fn(),
    findPendingJobs: vi.fn(),
    findDueJobs: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    incrementAttempts: vi.fn(),
    listAll: vi.fn(),
    listByStatus: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

/* =========================================================
   CREATE ORDER
========================================================= */

describe("Order Creation", () => {
  it("should create order and freeze price correctly", async () => {
    (db.query.products.findFirst as any).mockResolvedValue({
      id: "p1",
      storeId: "s1",
      status: "published",
    });

    (db.query.productVariants.findFirst as any).mockResolvedValue({
      id: "v1",
      price: 100,
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
      isPublic: true,
      isVacationMode: false,
    });

    (orderDb.findBuyer as any).mockResolvedValue({
      id: "b1",
    });

    (orderDb.create as any).mockResolvedValue([
      {
        id: "o1",
        status: "PENDING",
      },
    ]);

    const result = await orderService.createOrder({
      productId: "p1",
      variantId: "v1",
      quantity: 2,
      buyerEmail: "test@mail.com",
      buyerPhone: "9999999999",
      buyerName: "Test",
    });

    expect(result.totalAmount).toBe(200); // price freeze validation
    expect(result.status).toBe("PENDING");
  });

  it("should block order when store is in vacation mode", async () => {
    (db.query.products.findFirst as any).mockResolvedValue({
      id: "p1",
      storeId: "s1",
      status: "published",
    });

    (db.query.productVariants.findFirst as any).mockResolvedValue({
      id: "v1",
      price: 100,
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
      isPublic: true,
      isVacationMode: true,
    });

    await expect(
      orderService.createOrder({
        productId: "p1",
        variantId: "v1",
        quantity: 1,
      })
    ).rejects.toThrow(ApiError);
  });

  it("should block order when store is suspended", async () => {
    (db.query.products.findFirst as any).mockResolvedValue({
      id: "p1",
      storeId: "s1",
      status: "published",
    });

    (db.query.productVariants.findFirst as any).mockResolvedValue({
      id: "v1",
      price: 100,
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
      isPublic: true,
      isVacationMode: false,
      isSuspended: true,
    });

    await expect(
      orderService.createOrder({
        productId: "p1",
        variantId: "v1",
        quantity: 1,
      })
    ).rejects.toThrow(ApiError);
  });
});

/* =========================================================
   LIFECYCLE TRANSITION
========================================================= */

describe("Lifecycle Transition Validation", () => {
  it("should allow valid transition and create digital download on PAID if digital", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      status: "PENDING",
      storeId: "s1",
      productId: "p1",
      variantId: "v1",
    });

    (db.query.products.findFirst as any).mockResolvedValue({
      id: "p1",
      productType: "DIGITAL",
      deletedAt: null,
    });

    await orderService.updateStatusCreator(
      "o1",
      "PAID",
      "user1"
    );

    expect(orderDb.updateStatus).toHaveBeenCalledWith("o1", "PAID");
    expect(downloadService.createDigitalDownload).toHaveBeenCalledWith(
      "o1",
      "p1",
      "v1"
    );
  });

  it("should reject invalid transition", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      status: "PENDING",
      storeId: "s1",
    });

    await expect(
      orderService.updateStatusCreator(
        "o1",
        "DELIVERED",
        "user1"
      )
    ).rejects.toThrow(ApiError);
  });
  it("should create payout on delivered status", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      status: "SHIPPED",
      storeId: "s1",
      totalAmount: 200,
      buyerId: "buyer1",
    });

    (orderDb.findBuyerById as any).mockResolvedValue({
      id: "buyer1",
      email: "buyer@example.com",
    });

    await orderService.updateStatusCreator(
      "o1",
      "DELIVERED",
      "user1"
    );

    expect(orderDb.updateStatus).toHaveBeenCalledWith("o1", "DELIVERED");
    expect(payoutService.createPayoutForOrder).toHaveBeenCalledWith(
      expect.objectContaining({ id: "o1" })
    );
  });});

/* =========================================================
   CREATOR STORE ISOLATION
========================================================= */

describe("Creator Store Isolation", () => {
  it("should block creator updating another store's order", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      status: "PENDING",
      storeId: "s2",
    });

    await expect(
      orderService.updateStatusCreator(
        "o1",
        "PAID",
        "user1"
      )
    ).rejects.toThrow(ApiError);
  });

  it("should return creator order by id only when it belongs to the creator's store", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      storeId: "s1",
    });

    const order = await orderService.getOrderForCreator(
      "user1",
      "o1"
    );

    expect(order).toEqual({ id: "o1", storeId: "s1" });
  });

  it("should allow creator list filters to pass through to the store query", async () => {
    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    (orderDb.listByStore as any).mockResolvedValue([
      { id: "o1", status: "PAID" },
    ]);

    const orders = await orderService.listOrdersForCreator("user1", {
      status: "PAID",
      from: "2025-01-01",
      to: "2025-01-31",
    });

    expect(orderDb.listByStore).toHaveBeenCalledWith("s1", {
      status: "PAID",
      from: "2025-01-01",
      to: "2025-01-31",
    });
    expect(orders).toEqual([{ id: "o1", status: "PAID" }]);
  });
});

/* =========================================================
   ADMIN OVERRIDE
========================================================= */

describe("Admin Override", () => {
  it("should allow admin to update status without transition validation", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      status: "PENDING",
      buyerId: "buyer1",
    });

    (orderDb.findBuyerById as any).mockResolvedValue({
      id: "buyer1",
      email: "buyer@example.com",
    });

    await orderService.updateStatusAdmin(
      "o1",
      "DELIVERED"
    );

    expect(orderDb.updateStatus).toHaveBeenCalled();
  });
});

/* =========================================================
   REFUND VALIDATION
========================================================= */

describe("Refund Validation", () => {
  it("should reject refund greater than total amount", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      totalAmount: 100,
      storeId: "s1",
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    await expect(
      orderService.markRefund("o1", 200, "user1")
    ).rejects.toThrow(ApiError);
  });

  it("should allow valid refund", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      totalAmount: 100,
      storeId: "s1",
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
    });

    await orderService.markRefund("o1", 50, "user1");

    expect(orderDb.updateRefund).toHaveBeenCalledWith(
      "o1",
      { isRefunded: true, refundAmount: 50 }
    );
  });
});