"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const api_error_1 = require("../shared/api-error");
const order_db_1 = require("../orders/order.db");
const db_1 = require("../../config/db");
const message_db_1 = require("./message.db");
const store_db_1 = require("../stores/store.db");
const admin_audit_service_1 = require("../admin/admin-audit.service");
const drizzle_orm_1 = require("drizzle-orm");
async function resolveOrder(orderId) {
    const order = await order_db_1.orderDb.findById(orderId);
    if (!order)
        throw new api_error_1.ApiError(404, "Order not found");
    if (order.status === "CANCELLED")
        throw new api_error_1.ApiError(400, "Cannot message on cancelled order");
    return order;
}
function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}
function normalizePhone(phone) {
    return String(phone || "").replace(/\D/g, "");
}
function matchesGuestIdentity(order, email, phone) {
    const normalizedOrderEmail = normalizeEmail(order.buyerEmail);
    const normalizedOrderPhone = normalizePhone(order.buyerPhone);
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const phoneMatches = normalizedOrderPhone === normalizedPhone ||
        normalizedOrderPhone.endsWith(normalizedPhone) ||
        normalizedPhone.endsWith(normalizedOrderPhone);
    return normalizedOrderEmail === normalizedEmail && phoneMatches;
}
async function resolveStore(storeId) {
    const store = await db_1.db.query.stores.findFirst({
        where: (0, drizzle_orm_1.eq)(store_db_1.stores.id, storeId),
    });
    if (!store)
        throw new api_error_1.ApiError(404, "Store not found");
    return store;
}
async function getOrCreateConversation(order, buyerEmail) {
    let conversation = await message_db_1.messageDb.findConversationByOrderId(order.id);
    if (!conversation) {
        const store = await resolveStore(order.storeId);
        const result = await message_db_1.messageDb.createConversation({
            orderId: order.id,
            storeId: order.storeId,
            creatorId: store.userId,
            buyerId: order.buyerId,
            buyerEmail,
            isDisputed: false,
        });
        if (!result || !result.length) {
            throw new api_error_1.ApiError(500, "Failed to create conversation");
        }
        const createdConversation = result[0];
        if (!createdConversation) {
            throw new api_error_1.ApiError(500, "Failed to create conversation");
        }
        conversation = createdConversation;
    }
    return conversation;
}
exports.messageService = {
    // Buyer flows (guest supported)
    async sendBuyerMessage(orderId, email, phone, content) {
        const order = await resolveOrder(orderId);
        if (!matchesGuestIdentity(order, email, phone)) {
            throw new api_error_1.ApiError(403, "Guest identity does not match order");
        }
        const conversation = await getOrCreateConversation(order, email);
        const message = await message_db_1.messageDb.createMessage({
            conversationId: conversation.id,
            senderRole: "BUYER",
            senderId: order.buyerId || email,
            content,
        });
        if (!message || !message.length) {
            throw new api_error_1.ApiError(500, "Failed to save message");
        }
        return message[0];
    },
    async getBuyerMessages(orderId, email, phone) {
        const order = await resolveOrder(orderId);
        if (!matchesGuestIdentity(order, email, phone)) {
            throw new api_error_1.ApiError(403, "Guest identity does not match order");
        }
        const conversation = await message_db_1.messageDb.findConversationByOrderId(orderId);
        if (!conversation) {
            return { conversation: null, messages: [] };
        }
        const messages = await message_db_1.messageDb.listMessagesByConversation(conversation.id);
        return { conversation, messages };
    },
    // Creator flows
    async listCreatorConversations(userId) {
        const store = await db_1.db.query.stores.findFirst({
            where: (0, drizzle_orm_1.eq)(store_db_1.stores.userId, userId),
        });
        if (!store)
            throw new api_error_1.ApiError(404, "Store not found for creator");
        return message_db_1.messageDb.listConversationsByStore(store.id);
    },
    async getCreatorConversation(conversationId, userId) {
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (conversation.creatorId !== userId)
            throw new api_error_1.ApiError(403, "Access denied");
        const messages = await message_db_1.messageDb.listMessagesByConversation(conversationId);
        return { conversation, messages };
    },
    async sendCreatorMessage(conversationId, userId, content) {
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (conversation.creatorId !== userId)
            throw new api_error_1.ApiError(403, "Access denied");
        const store = await resolveStore(conversation.storeId);
        if (store.isSuspended) {
            throw new api_error_1.ApiError(403, "Cannot send message: store is suspended");
        }
        const message = await message_db_1.messageDb.createMessage({
            conversationId,
            senderRole: "CREATOR",
            senderId: userId,
            content,
        });
        if (!message || !message.length) {
            throw new api_error_1.ApiError(500, "Failed to save message");
        }
        return message[0];
    },
    // Dispute escalation by buyer
    async escalateDispute(conversationId, orderId, email, phone) {
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (conversation.orderId !== orderId)
            throw new api_error_1.ApiError(400, "Conversation/order mismatch");
        const order = await resolveOrder(orderId);
        if (!matchesGuestIdentity(order, email, phone)) {
            throw new api_error_1.ApiError(403, "Guest identity does not match order");
        }
        if (!matchesGuestIdentity({ buyerEmail: conversation.buyerEmail, buyerPhone: order.buyerPhone }, email, phone)) {
            throw new api_error_1.ApiError(403, "Access denied");
        }
        if (conversation.isDisputed) {
            throw new api_error_1.ApiError(400, "Conversation is already disputed");
        }
        return message_db_1.messageDb.setDispute(conversationId, true);
    },
    // Admin flows
    async listAdminConversations(query) {
        return message_db_1.messageDb.listConversationsByFilter(query);
    },
    async getAdminConversation(conversationId) {
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        const messages = await message_db_1.messageDb.listMessagesByConversation(conversationId);
        return { conversation, messages };
    },
    async resolveDispute(conversationId) {
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (!conversation.isDisputed) {
            throw new api_error_1.ApiError(400, "Conversation is not disputed");
        }
        await message_db_1.messageDb.setDispute(conversationId, false);
        return { ...conversation, isDisputed: false };
    },
    async softDeleteMessage(messageId) {
        const message = await message_db_1.messageDb.findMessageById(messageId);
        if (!message)
            throw new api_error_1.ApiError(404, "Message not found");
        await message_db_1.messageDb.softDeleteMessage(messageId);
        await admin_audit_service_1.adminAuditService.log({
            adminId: "system",
            action: "message_soft_delete",
            entityType: "message",
            entityId: messageId,
            metadata: { messageId },
        });
        return { ...message, deletedAt: new Date() };
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9tZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL21vZHVsZXMvbWVzc2FnZXMvbWVzc2FnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUErQztBQUMvQyxpREFBNkM7QUFDN0Msd0NBQXFDO0FBQ3JDLDZDQUF5QztBQUN6QyxpREFBMEQ7QUFDMUQsc0VBQWlFO0FBQ2pFLDZDQUFpQztBQUVqQyxLQUFLLFVBQVUsWUFBWSxDQUFDLE9BQWU7SUFDekMsTUFBTSxLQUFLLEdBQUcsTUFBTSxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxJQUFJLENBQUMsS0FBSztRQUFFLE1BQU0sSUFBSSxvQkFBUSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxXQUFXO1FBQUUsTUFBTSxJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7SUFFL0YsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsS0FBYTtJQUNuQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbEQsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDbkMsT0FBTyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBVSxFQUFFLEtBQWEsRUFBRSxLQUFhO0lBQ3BFLE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5RCxNQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxLQUFL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QUMsVUFBVSxFQUFFLENBQUM7WUFDN0IsTUFBTSxJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUVELE1BQU0sc0JBQVMsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELE9BQU8sRUFBRSxHQUFHLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFpQjtRQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFTLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDM0QsTUFBTSxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sdUNBQWlCLENBQUMsR0FBRyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQy9DLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBpRXJyb3IgfSBmcm9tIFwiLi4vc2hhcmVkL2FwaS1lcnJvclwiO1xuaW1wb3J0IHsgb3JkZXJEYiB9IGZyb20gXCIuLi9vcmRlcnMvb3JkZXIuZGJcIjtcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9kYlwiO1xuaW1wb3J0IHsgbWVzc2FnZURiIH0gZnJvbSBcIi4vbWVzc2FnZS5kYlwiO1xuaW1wb3J0IHsgc3RvcmVzIGFzIHN0b3JlVGFibGUgfSBmcm9tIFwiLi4vc3RvcmVzL3N0b3JlLmRiXCI7XG5pbXBvcnQgeyBhZG1pbkF1ZGl0U2VydmljZSB9IGZyb20gXCIuLi9hZG1pbi9hZG1pbi1hdWRpdC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBlcSB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlT3JkZXIob3JkZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IG9yZGVyID0gYXdhaXQgb3JkZXJEYi5maW5kQnlJZChvcmRlcklkKTtcbiAgaWYgKCFvcmRlcikgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJPcmRlciBub3QgZm91bmRcIik7XG4gIGlmIChvcmRlci5zdGF0dXMgPT09IFwiQ0FOQ0VMTEVEXCIpIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiQ2Fubm90IG1lc3NhZ2Ugb24gY2FuY2VsbGVkIG9yZGVyXCIpO1xuXG4gIHJldHVybiBvcmRlcjtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRW1haWwoZW1haWw6IHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKGVtYWlsIHx8IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQaG9uZShwaG9uZTogc3RyaW5nKSB7XG4gIHJldHVybiBTdHJpbmcocGhvbmUgfHwgXCJcIikucmVwbGFjZSgvXFxEL2csIFwiXCIpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzR3Vlc3RJZGVudGl0eShvcmRlcjogYW55LCBlbWFpbDogc3RyaW5nLCBwaG9uZTogc3RyaW5nKSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRPcmRlckVtYWlsID0gbm9ybWFsaXplRW1haWwob3JkZXIuYnV5ZXJFbWFpbCk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRPcmRlclBob25lID0gbm9ybWFsaXplUGhvbmUob3JkZXIuYnV5ZXJQaG9uZSk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRFbWFpbCA9IG5vcm1hbGl6ZUVtYWlsKGVtYWlsKTtcbiAgY29uc3Qgbm9ybWFsaXplZFBob25lID0gbm9ybWFsaXplUGhvbmUocGhvbmUpO1xuXG4gIGNvbnN0IHBob25lTWF0Y2hlcyA9XG4gICAgbm9ybWFsaXplZE9yZGVyUGhvbmUgPT09IG5vcm1hbGl6ZWRQaG9uZSB8fFxuICAgIG5vcm1hbGl6ZWRPcmRlclBob25lLmVuZHNXaXRoKG5vcm1hbGl6ZWRQaG9uZSkgfHxcbiAgICBub3JtYWxpemVkUGhvbmUuZW5kc1dpdGgobm9ybWFsaXplZE9yZGVyUGhvbmUpO1xuXG4gIHJldHVybiBub3JtYWxpemVkT3JkZXJFbWFpbCA9PT0gbm9ybWFsaXplZEVtYWlsICYmIHBob25lTWF0Y2hlcztcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZVN0b3JlKHN0b3JlSWQ6IHN0cmluZykge1xuICBjb25zdCBzdG9yZSA9IGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiBlcShzdG9yZVRhYmxlLmlkLCBzdG9yZUlkKSxcbiAgfSk7XG5cbiAgaWYgKCFzdG9yZSkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJTdG9yZSBub3QgZm91bmRcIik7XG4gIHJldHVybiBzdG9yZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0T3JDcmVhdGVDb252ZXJzYXRpb24ob3JkZXI6IGFueSwgYnV5ZXJFbWFpbDogc3RyaW5nKSB7XG4gIGxldCBjb252ZXJzYXRpb24gPSBhd2FpdCBtZXNzYWdlRGIuZmluZENvbnZlcnNhdGlvbkJ5T3JkZXJJZChvcmRlci5pZCk7XG5cbiAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IHJlc29sdmVTdG9yZShvcmRlci5zdG9yZUlkKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBtZXNzYWdlRGIuY3JlYXRlQ29udmVyc2F0aW9uKHtcbiAgICAgIG9yZGVySWQ6IG9yZGVyLmlkLFxuICAgICAgc3RvcmVJZDogb3JkZXIuc3RvcmVJZCxcbiAgICAgIGNyZWF0b3JJZDogc3RvcmUudXNlcklkLFxuICAgICAgYnV5ZXJJZDogb3JkZXIuYnV5ZXJJZCxcbiAgICAgIGJ1eWVyRW1haWwsXG4gICAgICBpc0Rpc3B1dGVkOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBjcmVhdGUgY29udmVyc2F0aW9uXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZWRDb252ZXJzYXRpb24gPSByZXN1bHRbMF07XG4gICAgaWYgKCFjcmVhdGVkQ29udmVyc2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBjcmVhdGUgY29udmVyc2F0aW9uXCIpO1xuICAgIH1cblxuICAgIGNvbnZlcnNhdGlvbiA9IGNyZWF0ZWRDb252ZXJzYXRpb247XG4gIH1cblxuICByZXR1cm4gY29udmVyc2F0aW9uO1xufVxuXG5leHBvcnQgY29uc3QgbWVzc2FnZVNlcnZpY2UgPSB7XG4gIC8vIEJ1eWVyIGZsb3dzIChndWVzdCBzdXBwb3J0ZWQpXG4gIGFzeW5jIHNlbmRCdXllck1lc3NhZ2Uob3JkZXJJZDogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwaG9uZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmRlciA9IGF3YWl0IHJlc29sdmVPcmRlcihvcmRlcklkKTtcbiAgICBpZiAoIW1hdGNoZXNHdWVzdElkZW50aXR5KG9yZGVyLCBlbWFpbCwgcGhvbmUpKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkd1ZXN0IGlkZW50aXR5IGRvZXMgbm90IG1hdGNoIG9yZGVyXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IGdldE9yQ3JlYXRlQ29udmVyc2F0aW9uKG9yZGVyLCBlbWFpbCk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgbWVzc2FnZURiLmNyZWF0ZU1lc3NhZ2Uoe1xuICAgICAgY29udmVyc2F0aW9uSWQ6IGNvbnZlcnNhdGlvbi5pZCxcbiAgICAgIHNlbmRlclJvbGU6IFwiQlVZRVJcIixcbiAgICAgIHNlbmRlcklkOiBvcmRlci5idXllcklkIHx8IGVtYWlsLFxuICAgICAgY29udGVudCxcbiAgICB9KTtcblxuICAgIGlmICghbWVzc2FnZSB8fCAhbWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig1MDAsIFwiRmFpbGVkIHRvIHNhdmUgbWVzc2FnZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVswXTtcbiAgfSxcblxuICBhc3luYyBnZXRCdXllck1lc3NhZ2VzKG9yZGVySWQ6IHN0cmluZywgZW1haWw6IHN0cmluZywgcGhvbmU6IHN0cmluZykge1xuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgcmVzb2x2ZU9yZGVyKG9yZGVySWQpO1xuICAgIGlmICghbWF0Y2hlc0d1ZXN0SWRlbnRpdHkob3JkZXIsIGVtYWlsLCBwaG9uZSkpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiR3Vlc3QgaWRlbnRpdHkgZG9lcyBub3QgbWF0Y2ggb3JkZXJcIik7XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gYXdhaXQgbWVzc2FnZURiLmZpbmRDb252ZXJzYXRpb25CeU9yZGVySWQob3JkZXJJZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHtcbiAgICAgIHJldHVybiB7IGNvbnZlcnNhdGlvbjogbnVsbCwgbWVzc2FnZXM6IFtdIH07XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBtZXNzYWdlRGIubGlzdE1lc3NhZ2VzQnlDb252ZXJzYXRpb24oY29udmVyc2F0aW9uLmlkKTtcbiAgICByZXR1cm4geyBjb252ZXJzYXRpb24sIG1lc3NhZ2VzIH07XG4gIH0sXG5cbiAgLy8gQ3JlYXRvciBmbG93c1xuICBhc3luYyBsaXN0Q3JlYXRvckNvbnZlcnNhdGlvbnModXNlcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKHN0b3JlVGFibGUudXNlcklkLCB1c2VySWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKCFzdG9yZSkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJTdG9yZSBub3QgZm91bmQgZm9yIGNyZWF0b3JcIik7XG5cbiAgICByZXR1cm4gbWVzc2FnZURiLmxpc3RDb252ZXJzYXRpb25zQnlTdG9yZShzdG9yZS5pZCk7XG4gIH0sXG5cbiAgYXN5bmMgZ2V0Q3JlYXRvckNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlJZChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiQ29udmVyc2F0aW9uIG5vdCBmb3VuZFwiKTtcbiAgICBpZiAoY29udmVyc2F0aW9uLmNyZWF0b3JJZCAhPT0gdXNlcklkKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IG1lc3NhZ2VEYi5saXN0TWVzc2FnZXNCeUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCk7XG4gICAgcmV0dXJuIHsgY29udmVyc2F0aW9uLCBtZXNzYWdlcyB9O1xuICB9LFxuXG4gIGFzeW5jIHNlbmRDcmVhdG9yTWVzc2FnZShjb252ZXJzYXRpb25JZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKSB7XG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gYXdhaXQgbWVzc2FnZURiLmZpbmRDb252ZXJzYXRpb25CeUlkKGNvbnZlcnNhdGlvbklkKTtcbiAgICBpZiAoIWNvbnZlcnNhdGlvbikgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJDb252ZXJzYXRpb24gbm90IGZvdW5kXCIpO1xuICAgIGlmIChjb252ZXJzYXRpb24uY3JlYXRvcklkICE9PSB1c2VySWQpIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiQWNjZXNzIGRlbmllZFwiKTtcblxuICAgIGNvbnN0IHN0b3JlID0gYXdhaXQgcmVzb2x2ZVN0b3JlKGNvbnZlcnNhdGlvbi5zdG9yZUlkKTtcbiAgICBpZiAoc3RvcmUuaXNTdXNwZW5kZWQpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiQ2Fubm90IHNlbmQgbWVzc2FnZTogc3RvcmUgaXMgc3VzcGVuZGVkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBtZXNzYWdlRGIuY3JlYXRlTWVzc2FnZSh7XG4gICAgICBjb252ZXJzYXRpb25JZCxcbiAgICAgIHNlbmRlclJvbGU6IFwiQ1JFQVRPUlwiLFxuICAgICAgc2VuZGVySWQ6IHVzZXJJZCxcbiAgICAgIGNvbnRlbnQsXG4gICAgfSk7XG5cbiAgICBpZiAoIW1lc3NhZ2UgfHwgIW1lc3NhZ2UubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBzYXZlIG1lc3NhZ2VcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VbMF07XG4gIH0sXG5cbiAgLy8gRGlzcHV0ZSBlc2NhbGF0aW9uIGJ5IGJ1eWVyXG4gIGFzeW5jIGVzY2FsYXRlRGlzcHV0ZShjb252ZXJzYXRpb25JZDogc3RyaW5nLCBvcmRlcklkOiBzdHJpbmcsIGVtYWlsOiBzdHJpbmcsIHBob25lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCBtZXNzYWdlRGIuZmluZENvbnZlcnNhdGlvbkJ5SWQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIkNvbnZlcnNhdGlvbiBub3QgZm91bmRcIik7XG4gICAgaWYgKGNvbnZlcnNhdGlvbi5vcmRlcklkICE9PSBvcmRlcklkKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIkNvbnZlcnNhdGlvbi9vcmRlciBtaXNtYXRjaFwiKTtcblxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgcmVzb2x2ZU9yZGVyKG9yZGVySWQpO1xuICAgIGlmICghbWF0Y2hlc0d1ZXN0SWRlbnRpdHkob3JkZXIsIGVtYWlsLCBwaG9uZSkpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiR3Vlc3QgaWRlbnRpdHkgZG9lcyBub3QgbWF0Y2ggb3JkZXJcIik7XG4gICAgfVxuXG4gICAgaWYgKCFtYXRjaGVzR3Vlc3RJZGVudGl0eSh7IGJ1eWVyRW1haWw6IGNvbnZlcnNhdGlvbi5idXllckVtYWlsLCBidXllclBob25lOiBvcmRlci5idXllclBob25lIH0sIGVtYWlsLCBwaG9uZSkpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiQWNjZXNzIGRlbmllZFwiKTtcbiAgICB9XG5cbiAgICBpZiAoY29udmVyc2F0aW9uLmlzRGlzcHV0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiQ29udmVyc2F0aW9uIGlzIGFscmVhZHkgZGlzcHV0ZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VEYi5zZXREaXNwdXRlKGNvbnZlcnNhdGlvbklkLCB0cnVlKTtcbiAgfSxcblxuICAvLyBBZG1pbiBmbG93c1xuICBhc3luYyBsaXN0QWRtaW5Db252ZXJzYXRpb25zKHF1ZXJ5OiBhbnkpIHtcbiAgICByZXR1cm4gbWVzc2FnZURiLmxpc3RDb252ZXJzYXRpb25zQnlGaWx0ZXIocXVlcnkpO1xuICB9LFxuXG4gIGFzeW5jIGdldEFkbWluQ29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCBtZXNzYWdlRGIuZmluZENvbnZlcnNhdGlvbkJ5SWQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIkNvbnZlcnNhdGlvbiBub3QgZm91bmRcIik7XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IG1lc3NhZ2VEYi5saXN0TWVzc2FnZXNCeUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCk7XG4gICAgcmV0dXJuIHsgY29udmVyc2F0aW9uLCBtZXNzYWdlcyB9O1xuICB9LFxuXG4gIGFzeW5jIHJlc29sdmVEaXNwdXRlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCBtZXNzYWdlRGIuZmluZENvbnZlcnNhdGlvbkJ5SWQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIkNvbnZlcnNhdGlvbiBub3QgZm91bmRcIik7XG5cbiAgICBpZiAoIWNvbnZlcnNhdGlvbi5pc0Rpc3B1dGVkKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIkNvbnZlcnNhdGlvbiBpcyBub3QgZGlzcHV0ZWRcIik7XG4gICAgfVxuXG4gICAgYXdhaXQgbWVzc2FnZURiLnNldERpc3B1dGUoY29udmVyc2F0aW9uSWQsIGZhbHNlKTtcbiAgICByZXR1cm4geyAuLi5jb252ZXJzYXRpb24sIGlzRGlzcHV0ZWQ6IGZhbHNlIH07XG4gIH0sXG5cbiAgYXN5bmMgc29mdERlbGV0ZU1lc3NhZ2UobWVzc2FnZUlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgbWVzc2FnZURiLmZpbmRNZXNzYWdlQnlJZChtZXNzYWdlSWQpO1xuICAgIGlmICghbWVzc2FnZSkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJNZXNzYWdlIG5vdCBmb3VuZFwiKTtcbiAgICBhd2FpdCBtZXNzYWdlRGIuc29mdERlbGV0ZU1lc3NhZ2UobWVzc2FnZUlkKTtcblxuICAgIGF3YWl0IGFkbWluQXVkaXRTZXJ2aWNlLmxvZyh7XG4gICAgICBhZG1pbklkOiBcInN5c3RlbVwiLFxuICAgICAgYWN0aW9uOiBcIm1lc3NhZ2Vfc29mdF9kZWxldGVcIixcbiAgICAgIGVudGl0eVR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgZW50aXR5SWQ6IG1lc3NhZ2VJZCxcbiAgICAgIG1ldGFkYXRhOiB7IG1lc3NhZ2VJZCB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgLi4ubWVzc2FnZSwgZGVsZXRlZEF0OiBuZXcgRGF0ZSgpIH07XG4gIH0sXG59O1xuIl19