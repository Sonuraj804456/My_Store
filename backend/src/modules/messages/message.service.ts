import { ApiError } from "../shared/api-error";
import { orderDb } from "../orders/order.db";
import { db } from "../../config/db";
import { messageDb } from "./message.db";
import { stores as storeTable } from "../stores/store.db";
import { adminAuditService } from "../admin/admin-audit.service";
import { eq } from "drizzle-orm";

async function resolveOrder(orderId: string) {
  const order = await orderDb.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.status === "CANCELLED") throw new ApiError(400, "Cannot message on cancelled order");

  return order;
}

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "");
}

function matchesGuestIdentity(order: any, email: string, phone: string) {
  const normalizedOrderEmail = normalizeEmail(order.buyerEmail);
  const normalizedOrderPhone = normalizePhone(order.buyerPhone);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  const phoneMatches =
    normalizedOrderPhone === normalizedPhone ||
    normalizedOrderPhone.endsWith(normalizedPhone) ||
    normalizedPhone.endsWith(normalizedOrderPhone);

  return normalizedOrderEmail === normalizedEmail && phoneMatches;
}

async function resolveStore(storeId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(storeTable.id, storeId),
  });

  if (!store) throw new ApiError(404, "Store not found");
  return store;
}

async function getOrCreateConversation(order: any, buyerEmail: string) {
  let conversation = await messageDb.findConversationByOrderId(order.id);

  if (!conversation) {
    const store = await resolveStore(order.storeId);
    const result = await messageDb.createConversation({
      orderId: order.id,
      storeId: order.storeId,
      creatorId: store.userId,
      buyerId: order.buyerId,
      buyerEmail,
      isDisputed: false,
    });

    if (!result || !result.length) {
      throw new ApiError(500, "Failed to create conversation");
    }

    const createdConversation = result[0];
    if (!createdConversation) {
      throw new ApiError(500, "Failed to create conversation");
    }

    conversation = createdConversation;
  }

  return conversation;
}

export const messageService = {
  // Buyer flows (guest supported)
  async sendBuyerMessage(orderId: string, email: string, phone: string, content: string) {
    const order = await resolveOrder(orderId);
    if (!matchesGuestIdentity(order, email, phone)) {
      throw new ApiError(403, "Guest identity does not match order");
    }

    const conversation = await getOrCreateConversation(order, email);

    const message = await messageDb.createMessage({
      conversationId: conversation.id,
      senderRole: "BUYER",
      senderId: order.buyerId || email,
      content,
    });

    if (!message || !message.length) {
      throw new ApiError(500, "Failed to save message");
    }

    return message[0];
  },

  async getBuyerMessages(orderId: string, email: string, phone: string) {
    const order = await resolveOrder(orderId);
    if (!matchesGuestIdentity(order, email, phone)) {
      throw new ApiError(403, "Guest identity does not match order");
    }

    const conversation = await messageDb.findConversationByOrderId(orderId);
    if (!conversation) {
      return { conversation: null, messages: [] };
    }

    const messages = await messageDb.listMessagesByConversation(conversation.id);
    return { conversation, messages };
  },

  // Creator flows
  async listCreatorConversations(userId: string) {
    const store = await db.query.stores.findFirst({
      where: eq(storeTable.userId, userId),
    });

    if (!store) throw new ApiError(404, "Store not found for creator");

    return messageDb.listConversationsByStore(store.id);
  },

  async getCreatorConversation(conversationId: string, userId: string) {
    const conversation = await messageDb.findConversationById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");
    if (conversation.creatorId !== userId) throw new ApiError(403, "Access denied");

    const messages = await messageDb.listMessagesByConversation(conversationId);
    return { conversation, messages };
  },

  async sendCreatorMessage(conversationId: string, userId: string, content: string) {
    const conversation = await messageDb.findConversationById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");
    if (conversation.creatorId !== userId) throw new ApiError(403, "Access denied");

    const store = await resolveStore(conversation.storeId);
    if (store.isSuspended) {
      throw new ApiError(403, "Cannot send message: store is suspended");
    }

    const message = await messageDb.createMessage({
      conversationId,
      senderRole: "CREATOR",
      senderId: userId,
      content,
    });

    if (!message || !message.length) {
      throw new ApiError(500, "Failed to save message");
    }

    return message[0];
  },

  // Dispute escalation by buyer
  async escalateDispute(conversationId: string, orderId: string, email: string, phone: string) {
    const conversation = await messageDb.findConversationById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");
    if (conversation.orderId !== orderId) throw new ApiError(400, "Conversation/order mismatch");

    const order = await resolveOrder(orderId);
    if (!matchesGuestIdentity(order, email, phone)) {
      throw new ApiError(403, "Guest identity does not match order");
    }

    if (!matchesGuestIdentity({ buyerEmail: conversation.buyerEmail, buyerPhone: order.buyerPhone }, email, phone)) {
      throw new ApiError(403, "Access denied");
    }

    if (conversation.isDisputed) {
      throw new ApiError(400, "Conversation is already disputed");
    }

    return messageDb.setDispute(conversationId, true);
  },

  // Admin flows
  async listAdminConversations(query: any) {
    return messageDb.listConversationsByFilter(query);
  },

  async getAdminConversation(conversationId: string) {
    const conversation = await messageDb.findConversationById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    const messages = await messageDb.listMessagesByConversation(conversationId);
    return { conversation, messages };
  },

  async resolveDispute(conversationId: string) {
    const conversation = await messageDb.findConversationById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    if (!conversation.isDisputed) {
      throw new ApiError(400, "Conversation is not disputed");
    }

    await messageDb.setDispute(conversationId, false);
    return { ...conversation, isDisputed: false };
  },

  async softDeleteMessage(messageId: string) {
    const message = await messageDb.findMessageById(messageId);
    if (!message) throw new ApiError(404, "Message not found");
    await messageDb.softDeleteMessage(messageId);

    await adminAuditService.log({
      adminId: "system",
      action: "message_soft_delete",
      entityType: "message",
      entityId: messageId,
      metadata: { messageId },
    });

    return { ...message, deletedAt: new Date() };
  },
};
