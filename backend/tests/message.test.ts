import { describe, it, expect, beforeEach, vi } from "vitest";
import { messageService } from "../src/modules/messages/message.service";
import { messageDb } from "../src/modules/messages/message.db";
import { orderDb } from "../src/modules/orders/order.db";
import { db } from "../src/config/db";
import { ApiError } from "../src/modules/shared/api-error";

vi.mock("../src/modules/messages/message.db", () => ({
  messageDb: {
    findConversationByOrderId: vi.fn(),
    createConversation: vi.fn(),
    findConversationById: vi.fn(),
    listConversationsByStore: vi.fn(),
    listConversationsByFilter: vi.fn(),
    setDispute: vi.fn(),
    createMessage: vi.fn(),
    listMessagesByConversation: vi.fn(),
    findMessageById: vi.fn(),
    softDeleteMessage: vi.fn(),
  },
}));

vi.mock("../src/modules/orders/order.db", () => ({
  orderDb: {
    findById: vi.fn(),
  },
}));

vi.mock("../src/config/db", () => ({
  db: {
    query: {
      stores: { findFirst: vi.fn() },
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Message module", () => {
  it("should create new conversation and message for buyer with correct guest info", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      storeId: "s1",
      buyerId: "b1",
      buyerEmail: "test@mail.com",
      buyerPhone: "9999999999",
      status: "PAID",
    });

    (messageDb.findConversationByOrderId as any).mockResolvedValue(null);
    (db.query.stores.findFirst as any).mockResolvedValue({ userId: "creator1" });
    (messageDb.createConversation as any).mockResolvedValue([{ id: "c1" }]);
    (messageDb.createMessage as any).mockResolvedValue([{ id: "m1", content: "hello" }]);

    const result = await messageService.sendBuyerMessage("o1", "test@mail.com", "9999999999", "hello");

    expect(result.id).toBe("m1");
    expect(messageDb.createConversation).toHaveBeenCalled();
    expect(messageDb.createMessage).toHaveBeenCalledWith(expect.objectContaining({ senderRole: "BUYER" }));
  });

  it("should normalize email/phone and allow buyer message for equivalent identity", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      storeId: "s1",
      buyerId: "b1",
      buyerEmail: "test@mail.com",
      buyerPhone: "9999999999",
      status: "PAID",
    });

    (messageDb.findConversationByOrderId as any).mockResolvedValue(null);
    (db.query.stores.findFirst as any).mockResolvedValue({ userId: "creator1" });
    (messageDb.createConversation as any).mockResolvedValue([{ id: "c1" }]);
    (messageDb.createMessage as any).mockResolvedValue([{ id: "m1", content: "hello" }]);

    const result = await messageService.sendBuyerMessage("o1", "  TEST@mail.com ", "+91-999-999-9999", "hello");

    expect(result.id).toBe("m1");
    expect(messageDb.createConversation).toHaveBeenCalled();
  });

  it("should block buyer message with invalid guest details", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      storeId: "s1",
      buyerEmail: "a@mail.com",
      buyerPhone: "111",
      status: "PAID",
    });

    await expect(
      messageService.sendBuyerMessage("o1", "wrong@mail.com", "111", "hey")
    ).rejects.toThrow(ApiError);
  });

  it("should enforce creator store isolation", async () => {
    (messageDb.findConversationById as any).mockResolvedValue({
      id: "c1",
      creatorId: "creator2",
    });

    await expect(
      messageService.getCreatorConversation("c1", "creator1")
    ).rejects.toThrow(ApiError);
  });

  it("should return buyer messages when credentials are normalized and in query", async () => {
    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      storeId: "s1",
      buyerId: "b1",
      buyerEmail: "test@mail.com",
      buyerPhone: "9999999999",
      status: "PAID",
    });

    (messageDb.findConversationByOrderId as any).mockResolvedValue({ id: "c1" });
    (messageDb.listMessagesByConversation as any).mockResolvedValue([{ id: "m1", content: "hello" }]);

    const result = await messageService.getBuyerMessages("o1", "TEST@mail.com", "+91-999-999-9999");
    expect(result.messages).toEqual([{ id: "m1", content: "hello" }]);
  });

  it("should block creator from sending message when store is suspended", async () => {
    (messageDb.findConversationById as any).mockResolvedValue({
      id: "c1",
      storeId: "s1",
      creatorId: "creator1",
    });

    (db.query.stores.findFirst as any).mockResolvedValue({
      id: "s1",
      isSuspended: true,
    });

    await expect(
      messageService.sendCreatorMessage("c1", "creator1", "hello")
    ).rejects.toThrow(ApiError);
  });

  it("should allow buyer to escalate dispute", async () => {
    (messageDb.findConversationById as any).mockResolvedValue({
      id: "c1",
      orderId: "o1",
      buyerEmail: "test@mail.com",
    });

    (orderDb.findById as any).mockResolvedValue({
      id: "o1",
      buyerEmail: "test@mail.com",
      buyerPhone: "9999999999",
      status: "PAID",
    });

    (messageDb.setDispute as any).mockResolvedValue({ isDisputed: true });

    const result = await messageService.escalateDispute("c1", "o1", "test@mail.com", "9999999999");

    expect(result).toEqual({ isDisputed: true });
    expect(messageDb.setDispute).toHaveBeenCalledWith("c1", true);
  });

  it("should resolve dispute as admin", async () => {
    (messageDb.findConversationById as any).mockResolvedValue({ id: "c1", isDisputed: true });
    (messageDb.setDispute as any).mockResolvedValue({ isDisputed: false });

    const result = await messageService.resolveDispute("c1");

    expect(messageDb.setDispute).toHaveBeenCalledWith("c1", false);
    expect(result.isDisputed).toBe(false);
  });

  it("should soft-delete message and return updated record", async () => {
    (messageDb.findMessageById as any).mockResolvedValue({ id: "m1", content: "nono" });
    (messageDb.softDeleteMessage as any).mockResolvedValue(1);

    const result = await messageService.softDeleteMessage("m1");

    expect(messageDb.softDeleteMessage).toHaveBeenCalledWith("m1");
    expect(result.deletedAt).toBeDefined();
  });
});
