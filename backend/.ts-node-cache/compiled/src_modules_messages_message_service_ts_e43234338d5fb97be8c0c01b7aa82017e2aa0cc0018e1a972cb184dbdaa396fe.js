"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const api_error_1 = require("../shared/api-error");
const order_db_1 = require("../orders/order.db");
const db_1 = require("../../config/db");
const message_db_1 = require("./message.db");
const store_db_1 = require("../stores/store.db");
const auth_schema_1 = require("../auth/auth.schema");
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
async function matchesGuestIdentity(order, email, phone) {
    // For new schema, get customer info from the customer record
    const customer = await db_1.db.query.customers.findFirst({
        where: (0, drizzle_orm_1.eq)(auth_schema_1.customers.id, order.customerId),
    });
    if (!customer)
        return false;
    const normalizedOrderEmail = normalizeEmail(customer.email);
    const normalizedOrderPhone = normalizePhone(customer.phone);
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
            merchantId: store.merchantId,
            customerId: order.customerId,
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
        if (!(await matchesGuestIdentity(order, email, phone))) {
            throw new api_error_1.ApiError(403, "Guest identity does not match order");
        }
        const conversation = await getOrCreateConversation(order, email);
        const message = await message_db_1.messageDb.createMessage({
            conversationId: conversation.id,
            senderRole: "CUSTOMER",
            senderId: order.customerId || email,
            content,
        });
        if (!message || !message.length) {
            throw new api_error_1.ApiError(500, "Failed to save message");
        }
        return message[0];
    },
    async getBuyerMessages(orderId, email, phone) {
        const order = await resolveOrder(orderId);
        if (!(await matchesGuestIdentity(order, email, phone))) {
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
        const merchant = await db_1.db.query.merchants.findFirst({
            where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, userId),
        });
        if (!merchant)
            throw new api_error_1.ApiError(404, "Merchant not found");
        const store = await db_1.db.query.stores.findFirst({
            where: (0, drizzle_orm_1.eq)(store_db_1.stores.merchantId, merchant.id),
        });
        if (!store)
            throw new api_error_1.ApiError(404, "Store not found for merchant");
        return message_db_1.messageDb.listConversationsByStore(store.id);
    },
    async getCreatorConversation(conversationId, userId) {
        const merchant = await db_1.db.query.merchants.findFirst({
            where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, userId),
        });
        if (!merchant)
            throw new api_error_1.ApiError(403, "Access denied: not a merchant");
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (conversation.merchantId !== merchant.id)
            throw new api_error_1.ApiError(403, "Access denied");
        const messages = await message_db_1.messageDb.listMessagesByConversation(conversationId);
        return { conversation, messages };
    },
    async sendCreatorMessage(conversationId, userId, content) {
        const merchant = await db_1.db.query.merchants.findFirst({
            where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, userId),
        });
        if (!merchant)
            throw new api_error_1.ApiError(403, "Access denied: not a merchant");
        const conversation = await message_db_1.messageDb.findConversationById(conversationId);
        if (!conversation)
            throw new api_error_1.ApiError(404, "Conversation not found");
        if (conversation.merchantId !== merchant.id)
            throw new api_error_1.ApiError(403, "Access denied");
        const store = await resolveStore(conversation.storeId);
        if (store.isSuspended) {
            throw new api_error_1.ApiError(403, "Cannot send message: store is suspended");
        }
        const message = await message_db_1.messageDb.createMessage({
            conversationId,
            senderRole: "MERCHANT",
            senderId: merchant.id,
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
        if (!(await matchesGuestIdentity(order, email, phone))) {
            throw new api_error_1.ApiError(403, "Guest identity does not match order");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9tZXNzYWdlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL21vZHVsZXMvbWVzc2FnZXMvbWVzc2FnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUErQztBQUMvQyxpREFBNkM7QUFDN0Msd0NBQXFDO0FBQ3JDLDZDQUF5QztBQUN6QyxpREFBMEQ7QUFDMUQscURBQTJEO0FBQzNELHNFQUFpRTtBQUNqRSw2Q0FBaUM7QUFFakMsS0FBSyxVQUFVLFlBQVksQ0FBQyxPQUFlO0lBQ3pDLE1BQU0sS0FBSyxHQUFHLE1BQU0sa0JBQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxNQUFNLElBQUksb0JBQVEsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUN2RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssV0FBVztRQUFFLE1BQU0sSUFBSSxvQkFBUSxDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0lBRS9GLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLEtBQWE7SUFDbkMsT0FBTyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2xELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFhO0lBQ25DLE9BQU8sTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsS0FBVSxFQUFFLEtBQWEsRUFBRSxLQUFhO0lBQzFFLDZEQUE2RDtJQUM3RCxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FB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QUFDO1FBQ2xELE9BQU8sRUFBRSxHQUFHLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFpQjtRQUN2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFTLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPO1lBQUUsTUFBTSxJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDM0QsTUFBTSxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sdUNBQWlCLENBQUMsR0FBRyxDQUFDO1lBQzFCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsVUFBVSxFQUFFLFNBQVM7WUFDckIsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQy9DLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBpRXJyb3IgfSBmcm9tIFwiLi4vc2hhcmVkL2FwaS1lcnJvclwiO1xuaW1wb3J0IHsgb3JkZXJEYiB9IGZyb20gXCIuLi9vcmRlcnMvb3JkZXIuZGJcIjtcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9kYlwiO1xuaW1wb3J0IHsgbWVzc2FnZURiIH0gZnJvbSBcIi4vbWVzc2FnZS5kYlwiO1xuaW1wb3J0IHsgc3RvcmVzIGFzIHN0b3JlVGFibGUgfSBmcm9tIFwiLi4vc3RvcmVzL3N0b3JlLmRiXCI7XG5pbXBvcnQgeyBtZXJjaGFudHMsIGN1c3RvbWVycyB9IGZyb20gXCIuLi9hdXRoL2F1dGguc2NoZW1hXCI7XG5pbXBvcnQgeyBhZG1pbkF1ZGl0U2VydmljZSB9IGZyb20gXCIuLi9hZG1pbi9hZG1pbi1hdWRpdC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBlcSB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlT3JkZXIob3JkZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IG9yZGVyID0gYXdhaXQgb3JkZXJEYi5maW5kQnlJZChvcmRlcklkKTtcbiAgaWYgKCFvcmRlcikgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJPcmRlciBub3QgZm91bmRcIik7XG4gIGlmIChvcmRlci5zdGF0dXMgPT09IFwiQ0FOQ0VMTEVEXCIpIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiQ2Fubm90IG1lc3NhZ2Ugb24gY2FuY2VsbGVkIG9yZGVyXCIpO1xuXG4gIHJldHVybiBvcmRlcjtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRW1haWwoZW1haWw6IHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKGVtYWlsIHx8IFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQaG9uZShwaG9uZTogc3RyaW5nKSB7XG4gIHJldHVybiBTdHJpbmcocGhvbmUgfHwgXCJcIikucmVwbGFjZSgvXFxEL2csIFwiXCIpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYXRjaGVzR3Vlc3RJZGVudGl0eShvcmRlcjogYW55LCBlbWFpbDogc3RyaW5nLCBwaG9uZTogc3RyaW5nKSB7XG4gIC8vIEZvciBuZXcgc2NoZW1hLCBnZXQgY3VzdG9tZXIgaW5mbyBmcm9tIHRoZSBjdXN0b21lciByZWNvcmRcbiAgY29uc3QgY3VzdG9tZXIgPSBhd2FpdCBkYi5xdWVyeS5jdXN0b21lcnMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogZXEoY3VzdG9tZXJzLmlkLCBvcmRlci5jdXN0b21lcklkKSxcbiAgfSk7XG5cbiAgaWYgKCFjdXN0b21lcikgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IG5vcm1hbGl6ZWRPcmRlckVtYWlsID0gbm9ybWFsaXplRW1haWwoY3VzdG9tZXIuZW1haWwpO1xuICBjb25zdCBub3JtYWxpemVkT3JkZXJQaG9uZSA9IG5vcm1hbGl6ZVBob25lKGN1c3RvbWVyLnBob25lKTtcbiAgY29uc3Qgbm9ybWFsaXplZEVtYWlsID0gbm9ybWFsaXplRW1haWwoZW1haWwpO1xuICBjb25zdCBub3JtYWxpemVkUGhvbmUgPSBub3JtYWxpemVQaG9uZShwaG9uZSk7XG5cbiAgY29uc3QgcGhvbmVNYXRjaGVzID1cbiAgICBub3JtYWxpemVkT3JkZXJQaG9uZSA9PT0gbm9ybWFsaXplZFBob25lIHx8XG4gICAgbm9ybWFsaXplZE9yZGVyUGhvbmUuZW5kc1dpdGgobm9ybWFsaXplZFBob25lKSB8fFxuICAgIG5vcm1hbGl6ZWRQaG9uZS5lbmRzV2l0aChub3JtYWxpemVkT3JkZXJQaG9uZSk7XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZWRPcmRlckVtYWlsID09PSBub3JtYWxpemVkRW1haWwgJiYgcGhvbmVNYXRjaGVzO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlU3RvcmUoc3RvcmVJZDogc3RyaW5nKSB7XG4gIGNvbnN0IHN0b3JlID0gYXdhaXQgZGIucXVlcnkuc3RvcmVzLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IGVxKHN0b3JlVGFibGUuaWQsIHN0b3JlSWQpLFxuICB9KTtcblxuICBpZiAoIXN0b3JlKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIlN0b3JlIG5vdCBmb3VuZFwiKTtcbiAgcmV0dXJuIHN0b3JlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRPckNyZWF0ZUNvbnZlcnNhdGlvbihvcmRlcjogYW55LCBidXllckVtYWlsOiBzdHJpbmcpIHtcbiAgbGV0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlPcmRlcklkKG9yZGVyLmlkKTtcblxuICBpZiAoIWNvbnZlcnNhdGlvbikge1xuICAgIGNvbnN0IHN0b3JlID0gYXdhaXQgcmVzb2x2ZVN0b3JlKG9yZGVyLnN0b3JlSWQpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG1lc3NhZ2VEYi5jcmVhdGVDb252ZXJzYXRpb24oe1xuICAgICAgb3JkZXJJZDogb3JkZXIuaWQsXG4gICAgICBzdG9yZUlkOiBvcmRlci5zdG9yZUlkLFxuICAgICAgbWVyY2hhbnRJZDogc3RvcmUubWVyY2hhbnRJZCxcbiAgICAgIGN1c3RvbWVySWQ6IG9yZGVyLmN1c3RvbWVySWQsXG4gICAgICBpc0Rpc3B1dGVkOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBjcmVhdGUgY29udmVyc2F0aW9uXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZWRDb252ZXJzYXRpb24gPSByZXN1bHRbMF07XG4gICAgaWYgKCFjcmVhdGVkQ29udmVyc2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBjcmVhdGUgY29udmVyc2F0aW9uXCIpO1xuICAgIH1cblxuICAgIGNvbnZlcnNhdGlvbiA9IGNyZWF0ZWRDb252ZXJzYXRpb247XG4gIH1cblxuICByZXR1cm4gY29udmVyc2F0aW9uO1xufVxuXG5leHBvcnQgY29uc3QgbWVzc2FnZVNlcnZpY2UgPSB7XG4gIC8vIEJ1eWVyIGZsb3dzIChndWVzdCBzdXBwb3J0ZWQpXG4gIGFzeW5jIHNlbmRCdXllck1lc3NhZ2Uob3JkZXJJZDogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwaG9uZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcbiAgICBjb25zdCBvcmRlciA9IGF3YWl0IHJlc29sdmVPcmRlcihvcmRlcklkKTtcbiAgICBpZiAoIShhd2FpdCBtYXRjaGVzR3Vlc3RJZGVudGl0eShvcmRlciwgZW1haWwsIHBob25lKSkpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiR3Vlc3QgaWRlbnRpdHkgZG9lcyBub3QgbWF0Y2ggb3JkZXJcIik7XG4gICAgfVxuXG4gICAgY29uc3QgY29udmVyc2F0aW9uID0gYXdhaXQgZ2V0T3JDcmVhdGVDb252ZXJzYXRpb24ob3JkZXIsIGVtYWlsKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBtZXNzYWdlRGIuY3JlYXRlTWVzc2FnZSh7XG4gICAgICBjb252ZXJzYXRpb25JZDogY29udmVyc2F0aW9uLmlkLFxuICAgICAgc2VuZGVyUm9sZTogXCJDVVNUT01FUlwiLFxuICAgICAgc2VuZGVySWQ6IG9yZGVyLmN1c3RvbWVySWQgfHwgZW1haWwsXG4gICAgICBjb250ZW50LFxuICAgIH0pO1xuXG4gICAgaWYgKCFtZXNzYWdlIHx8ICFtZXNzYWdlLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDUwMCwgXCJGYWlsZWQgdG8gc2F2ZSBtZXNzYWdlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXNzYWdlWzBdO1xuICB9LFxuXG4gIGFzeW5jIGdldEJ1eWVyTWVzc2FnZXMob3JkZXJJZDogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCBwaG9uZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3JkZXIgPSBhd2FpdCByZXNvbHZlT3JkZXIob3JkZXJJZCk7XG4gICAgaWYgKCEoYXdhaXQgbWF0Y2hlc0d1ZXN0SWRlbnRpdHkob3JkZXIsIGVtYWlsLCBwaG9uZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkd1ZXN0IGlkZW50aXR5IGRvZXMgbm90IG1hdGNoIG9yZGVyXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlPcmRlcklkKG9yZGVySWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB7XG4gICAgICByZXR1cm4geyBjb252ZXJzYXRpb246IG51bGwsIG1lc3NhZ2VzOiBbXSB9O1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbWVzc2FnZURiLmxpc3RNZXNzYWdlc0J5Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbi5pZCk7XG4gICAgcmV0dXJuIHsgY29udmVyc2F0aW9uLCBtZXNzYWdlcyB9O1xuICB9LFxuXG4gIC8vIENyZWF0b3IgZmxvd3NcbiAgYXN5bmMgbGlzdENyZWF0b3JDb252ZXJzYXRpb25zKHVzZXJJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgbWVyY2hhbnQgPSBhd2FpdCBkYi5xdWVyeS5tZXJjaGFudHMuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiBlcShtZXJjaGFudHMudXNlcklkLCB1c2VySWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKCFtZXJjaGFudCkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJNZXJjaGFudCBub3QgZm91bmRcIik7XG5cbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKHN0b3JlVGFibGUubWVyY2hhbnRJZCwgbWVyY2hhbnQuaWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKCFzdG9yZSkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJTdG9yZSBub3QgZm91bmQgZm9yIG1lcmNoYW50XCIpO1xuXG4gICAgcmV0dXJuIG1lc3NhZ2VEYi5saXN0Q29udmVyc2F0aW9uc0J5U3RvcmUoc3RvcmUuaWQpO1xuICB9LFxuXG4gIGFzeW5jIGdldENyZWF0b3JDb252ZXJzYXRpb24oY29udmVyc2F0aW9uSWQ6IHN0cmluZywgdXNlcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtZXJjaGFudCA9IGF3YWl0IGRiLnF1ZXJ5Lm1lcmNoYW50cy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKG1lcmNoYW50cy51c2VySWQsIHVzZXJJZCksXG4gICAgfSk7XG4gICAgaWYgKCFtZXJjaGFudCkgdGhyb3cgbmV3IEFwaUVycm9yKDQwMywgXCJBY2Nlc3MgZGVuaWVkOiBub3QgYSBtZXJjaGFudFwiKTtcblxuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlJZChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiQ29udmVyc2F0aW9uIG5vdCBmb3VuZFwiKTtcbiAgICBpZiAoY29udmVyc2F0aW9uLm1lcmNoYW50SWQgIT09IG1lcmNoYW50LmlkKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IG1lc3NhZ2VEYi5saXN0TWVzc2FnZXNCeUNvbnZlcnNhdGlvbihjb252ZXJzYXRpb25JZCk7XG4gICAgcmV0dXJuIHsgY29udmVyc2F0aW9uLCBtZXNzYWdlcyB9O1xuICB9LFxuXG4gIGFzeW5jIHNlbmRDcmVhdG9yTWVzc2FnZShjb252ZXJzYXRpb25JZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKSB7XG4gICAgY29uc3QgbWVyY2hhbnQgPSBhd2FpdCBkYi5xdWVyeS5tZXJjaGFudHMuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiBlcShtZXJjaGFudHMudXNlcklkLCB1c2VySWQpLFxuICAgIH0pO1xuICAgIGlmICghbWVyY2hhbnQpIHRocm93IG5ldyBBcGlFcnJvcig0MDMsIFwiQWNjZXNzIGRlbmllZDogbm90IGEgbWVyY2hhbnRcIik7XG5cbiAgICBjb25zdCBjb252ZXJzYXRpb24gPSBhd2FpdCBtZXNzYWdlRGIuZmluZENvbnZlcnNhdGlvbkJ5SWQoY29udmVyc2F0aW9uSWQpO1xuICAgIGlmICghY29udmVyc2F0aW9uKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIkNvbnZlcnNhdGlvbiBub3QgZm91bmRcIik7XG4gICAgaWYgKGNvbnZlcnNhdGlvbi5tZXJjaGFudElkICE9PSBtZXJjaGFudC5pZCkgdGhyb3cgbmV3IEFwaUVycm9yKDQwMywgXCJBY2Nlc3MgZGVuaWVkXCIpO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBhd2FpdCByZXNvbHZlU3RvcmUoY29udmVyc2F0aW9uLnN0b3JlSWQpO1xuICAgIGlmIChzdG9yZS5pc1N1c3BlbmRlZCkge1xuICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDQwMywgXCJDYW5ub3Qgc2VuZCBtZXNzYWdlOiBzdG9yZSBpcyBzdXNwZW5kZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IGF3YWl0IG1lc3NhZ2VEYi5jcmVhdGVNZXNzYWdlKHtcbiAgICAgIGNvbnZlcnNhdGlvbklkLFxuICAgICAgc2VuZGVyUm9sZTogXCJNRVJDSEFOVFwiLFxuICAgICAgc2VuZGVySWQ6IG1lcmNoYW50LmlkLFxuICAgICAgY29udGVudCxcbiAgICB9KTtcblxuICAgIGlmICghbWVzc2FnZSB8fCAhbWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig1MDAsIFwiRmFpbGVkIHRvIHNhdmUgbWVzc2FnZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVswXTtcbiAgfSxcblxuICAvLyBEaXNwdXRlIGVzY2FsYXRpb24gYnkgYnV5ZXJcbiAgYXN5bmMgZXNjYWxhdGVEaXNwdXRlKGNvbnZlcnNhdGlvbklkOiBzdHJpbmcsIG9yZGVySWQ6IHN0cmluZywgZW1haWw6IHN0cmluZywgcGhvbmU6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlJZChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiQ29udmVyc2F0aW9uIG5vdCBmb3VuZFwiKTtcbiAgICBpZiAoY29udmVyc2F0aW9uLm9yZGVySWQgIT09IG9yZGVySWQpIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiQ29udmVyc2F0aW9uL29yZGVyIG1pc21hdGNoXCIpO1xuXG4gICAgY29uc3Qgb3JkZXIgPSBhd2FpdCByZXNvbHZlT3JkZXIob3JkZXJJZCk7XG4gICAgaWYgKCEoYXdhaXQgbWF0Y2hlc0d1ZXN0SWRlbnRpdHkob3JkZXIsIGVtYWlsLCBwaG9uZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkd1ZXN0IGlkZW50aXR5IGRvZXMgbm90IG1hdGNoIG9yZGVyXCIpO1xuICAgIH1cblxuICAgIGlmIChjb252ZXJzYXRpb24uaXNEaXNwdXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDQwMCwgXCJDb252ZXJzYXRpb24gaXMgYWxyZWFkeSBkaXNwdXRlZFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZURiLnNldERpc3B1dGUoY29udmVyc2F0aW9uSWQsIHRydWUpO1xuICB9LFxuXG4gIC8vIEFkbWluIGZsb3dzXG4gIGFzeW5jIGxpc3RBZG1pbkNvbnZlcnNhdGlvbnMocXVlcnk6IGFueSkge1xuICAgIHJldHVybiBtZXNzYWdlRGIubGlzdENvbnZlcnNhdGlvbnNCeUZpbHRlcihxdWVyeSk7XG4gIH0sXG5cbiAgYXN5bmMgZ2V0QWRtaW5Db252ZXJzYXRpb24oY29udmVyc2F0aW9uSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlJZChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiQ29udmVyc2F0aW9uIG5vdCBmb3VuZFwiKTtcblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbWVzc2FnZURiLmxpc3RNZXNzYWdlc0J5Q29udmVyc2F0aW9uKGNvbnZlcnNhdGlvbklkKTtcbiAgICByZXR1cm4geyBjb252ZXJzYXRpb24sIG1lc3NhZ2VzIH07XG4gIH0sXG5cbiAgYXN5bmMgcmVzb2x2ZURpc3B1dGUoY29udmVyc2F0aW9uSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbnZlcnNhdGlvbiA9IGF3YWl0IG1lc3NhZ2VEYi5maW5kQ29udmVyc2F0aW9uQnlJZChjb252ZXJzYXRpb25JZCk7XG4gICAgaWYgKCFjb252ZXJzYXRpb24pIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiQ29udmVyc2F0aW9uIG5vdCBmb3VuZFwiKTtcblxuICAgIGlmICghY29udmVyc2F0aW9uLmlzRGlzcHV0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiQ29udmVyc2F0aW9uIGlzIG5vdCBkaXNwdXRlZFwiKTtcbiAgICB9XG5cbiAgICBhd2FpdCBtZXNzYWdlRGIuc2V0RGlzcHV0ZShjb252ZXJzYXRpb25JZCwgZmFsc2UpO1xuICAgIHJldHVybiB7IC4uLmNvbnZlcnNhdGlvbiwgaXNEaXNwdXRlZDogZmFsc2UgfTtcbiAgfSxcblxuICBhc3luYyBzb2Z0RGVsZXRlTWVzc2FnZShtZXNzYWdlSWQ6IHN0cmluZykge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBhd2FpdCBtZXNzYWdlRGIuZmluZE1lc3NhZ2VCeUlkKG1lc3NhZ2VJZCk7XG4gICAgaWYgKCFtZXNzYWdlKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIk1lc3NhZ2Ugbm90IGZvdW5kXCIpO1xuICAgIGF3YWl0IG1lc3NhZ2VEYi5zb2Z0RGVsZXRlTWVzc2FnZShtZXNzYWdlSWQpO1xuXG4gICAgYXdhaXQgYWRtaW5BdWRpdFNlcnZpY2UubG9nKHtcbiAgICAgIGFkbWluSWQ6IFwic3lzdGVtXCIsXG4gICAgICBhY3Rpb246IFwibWVzc2FnZV9zb2Z0X2RlbGV0ZVwiLFxuICAgICAgZW50aXR5VHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICBlbnRpdHlJZDogbWVzc2FnZUlkLFxuICAgICAgbWV0YWRhdGE6IHsgbWVzc2FnZUlkIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4geyAuLi5tZXNzYWdlLCBkZWxldGVkQXQ6IG5ldyBEYXRlKCkgfTtcbiAgfSxcbn07XG4iXX0=