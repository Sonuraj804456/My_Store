"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const api_error_1 = require("../shared/api-error");
const db_1 = require("../../config/db");
const product_db_1 = require("../products/product.db");
const download_db_1 = require("./download.db");
const order_db_1 = require("../orders/order.db");
const drizzle_orm_1 = require("drizzle-orm");
const store_db_1 = require("../stores/store.db");
const auth_schema_1 = require("../auth/auth.schema");
const toHexToken = () => crypto_1.default.randomBytes(32).toString("hex");
exports.downloadService = {
    createDigitalDownload: async (orderId, productId, variantId) => {
        const existing = await download_db_1.downloadDb.findByOrderId(orderId);
        if (existing)
            return existing;
        const token = toHexToken();
        const [download] = await download_db_1.downloadDb.create({
            orderId,
            productId,
            variantId,
            token,
            maxDownloads: null,
            downloadCount: 0,
            expiresAt: null,
        });
        if (!download) {
            throw new api_error_1.ApiError(500, "Failed to create digital download record");
        }
        return download;
    },
    findByOrderId: async (orderId) => {
        return download_db_1.downloadDb.findByOrderId(orderId);
    },
    resolveToken: async (token, ip, userAgent) => {
        const record = await download_db_1.downloadDb.findByToken(token);
        if (!record)
            throw new api_error_1.ApiError(404, "Invalid download token");
        const order = await db_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(order_db_1.orders.id, record.orderId),
        });
        if (!order)
            throw new api_error_1.ApiError(404, "Order not found");
        if (order.status === "CANCELLED") {
            throw new api_error_1.ApiError(400, "Order is cancelled");
        }
        if (order.isRefunded) {
            throw new api_error_1.ApiError(400, "Order has been refunded");
        }
        if (order.status !== "PAID") {
            throw new api_error_1.ApiError(400, "Order not paid");
        }
        if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
            throw new api_error_1.ApiError(400, "Download token expired");
        }
        if (record.maxDownloads !== null &&
            record.downloadCount >= record.maxDownloads) {
            throw new api_error_1.ApiError(400, "Download limit reached");
        }
        const fileMedia = await db_1.db
            .select()
            .from(product_db_1.productMedia)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(product_db_1.productMedia.productId, record.productId), (0, drizzle_orm_1.eq)(product_db_1.productMedia.type, "file")));
        if (fileMedia.length === 0 || !fileMedia[0]) {
            throw new api_error_1.ApiError(400, "No file media available for this product");
        }
        await download_db_1.downloadDb.incrementCount(record.id);
        await download_db_1.downloadDb.logAccess({
            digitalDownloadId: record.id,
            ipAddress: ip,
            userAgent,
        });
        return { url: fileMedia[0].url };
    },
    listByProduct: async (productId) => {
        return download_db_1.downloadDb.listByProductId(productId);
    },
    listByProductForCreator: async (userId, productId) => {
        const merchant = await db_1.db.query.merchants.findFirst({
            where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, userId),
        });
        if (!merchant) {
            throw new api_error_1.ApiError(404, "Merchant not found for this user");
        }
        const store = await db_1.db.query.stores.findFirst({
            where: (0, drizzle_orm_1.eq)(store_db_1.stores.merchantId, merchant.id),
        });
        if (!store) {
            throw new api_error_1.ApiError(404, "Store not found for this merchant");
        }
        const product = await db_1.db.query.products.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(product_db_1.products.id, productId), (0, drizzle_orm_1.eq)(product_db_1.products.storeId, store.id)),
        });
        if (!product) {
            throw new api_error_1.ApiError(404, "Product not found");
        }
        return download_db_1.downloadDb.listByProductId(productId);
    },
    getTokenForUser: async (user, orderId) => {
        const order = await db_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(order_db_1.orders.id, orderId),
        });
        if (!order)
            throw new api_error_1.ApiError(404, "Order not found");
        if (order.status !== "PAID")
            throw new api_error_1.ApiError(400, "Order not paid");
        // Check if user is a customer who owns this order
        const customer = await db_1.db.query.customers.findFirst({
            where: (0, drizzle_orm_1.eq)(auth_schema_1.customers.userId, user.id),
        });
        if (customer && order.customerId === customer.id) {
            // User is a customer and owns this order
        }
        else {
            // Check if user is a merchant who owns the store
            const merchant = await db_1.db.query.merchants.findFirst({
                where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, user.id),
            });
            if (merchant) {
                const product = await db_1.db.query.products.findFirst({
                    where: (0, drizzle_orm_1.eq)(product_db_1.products.id, order.productId),
                });
                if (!product)
                    throw new api_error_1.ApiError(404, "Product not found");
                const store = await db_1.db.query.stores.findFirst({
                    where: (0, drizzle_orm_1.eq)(store_db_1.stores.id, product.storeId),
                });
                if (!store)
                    throw new api_error_1.ApiError(404, "Store not found");
                if (store.merchantId !== merchant.id)
                    throw new api_error_1.ApiError(403, "Forbidden");
            }
            else {
                // Check if user is admin
                const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
                if (!adminUserIds.includes(user.id)) {
                    throw new api_error_1.ApiError(403, "Forbidden");
                }
            }
        }
        const download = await download_db_1.downloadDb.findByOrderId(orderId);
        if (!download)
            throw new api_error_1.ApiError(404, "Download token not found");
        return { token: download.token };
    },
    listAll: async () => {
        return download_db_1.downloadDb.listAll();
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9kb3dubG9hZC9kb3dubG9hZC5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL2Rvd25sb2FkL2Rvd25sb2FkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG1EQUErQztBQUMvQyx3Q0FBcUM7QUFDckMsdURBQWdFO0FBQ2hFLCtDQUEyRTtBQUMzRSxpREFBNEM7QUFDNUMsNkNBQXNDO0FBQ3RDLGlEQUE0QztBQUM1QyxxREFBMkQ7QUFFM0QsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRW5ELFFBQUEsZUFBZSxHQUFHO0lBQzdCLHFCQUFxQixFQUFFLEtBQUssRUFDMUIsT0FBZSxFQUNmLFNBQWlCLEVBQ2pCLFNBQWlCLEVBQ2pCLEVBQUU7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLHdCQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELElBQUksUUFBUTtZQUFFLE9BQU8sUUFBUSxDQUFDO1FBRTlCLE1BQU0sS0FBSyxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBRTNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLHdCQUFVLENBQUMsTUFBTSxDQUFDO1lBQ3pDLE9BQU87WUFDUCxTQUFTO1lBQ1QsU0FBUztZQUNULEtBQUs7WUFDTCxZQUFZLEVBQUUsSUFBSTtZQUNsQixhQUFhLEVBQUUsQ0FBQztZQUNoQixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxNQUFNLElBQUksb0JBQVEsQ0FBQyxHQUFHLEVBQUUsMENBQTBDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELGFB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RCxJQUFJLENBQUMsUUFBUTtZQUFFLE1BQU0sSUFBSSxvQkFBUSxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBRW5FLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEIsT0FBTyx3QkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzlCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tIFwiY3J5cHRvXCI7XG5pbXBvcnQgeyBBcGlFcnJvciB9IGZyb20gXCIuLi9zaGFyZWQvYXBpLWVycm9yXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuLi8uLi9jb25maWcvZGJcIjtcbmltcG9ydCB7IHByb2R1Y3RzLCBwcm9kdWN0TWVkaWEgfSBmcm9tIFwiLi4vcHJvZHVjdHMvcHJvZHVjdC5kYlwiO1xuaW1wb3J0IHsgZGlnaXRhbERvd25sb2FkcywgZG93bmxvYWREYiwgZG93bmxvYWRMb2dzIH0gZnJvbSBcIi4vZG93bmxvYWQuZGJcIjtcbmltcG9ydCB7IG9yZGVycyB9IGZyb20gXCIuLi9vcmRlcnMvb3JkZXIuZGJcIjtcbmltcG9ydCB7IGFuZCwgZXEgfSBmcm9tIFwiZHJpenpsZS1vcm1cIjtcbmltcG9ydCB7IHN0b3JlcyB9IGZyb20gXCIuLi9zdG9yZXMvc3RvcmUuZGJcIjtcbmltcG9ydCB7IGN1c3RvbWVycywgbWVyY2hhbnRzIH0gZnJvbSBcIi4uL2F1dGgvYXV0aC5zY2hlbWFcIjtcblxuY29uc3QgdG9IZXhUb2tlbiA9ICgpID0+IGNyeXB0by5yYW5kb21CeXRlcygzMikudG9TdHJpbmcoXCJoZXhcIik7XG5cbmV4cG9ydCBjb25zdCBkb3dubG9hZFNlcnZpY2UgPSB7XG4gIGNyZWF0ZURpZ2l0YWxEb3dubG9hZDogYXN5bmMgKFxuICAgIG9yZGVySWQ6IHN0cmluZyxcbiAgICBwcm9kdWN0SWQ6IHN0cmluZyxcbiAgICB2YXJpYW50SWQ6IHN0cmluZ1xuICApID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGRvd25sb2FkRGIuZmluZEJ5T3JkZXJJZChvcmRlcklkKTtcbiAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZztcblxuICAgIGNvbnN0IHRva2VuID0gdG9IZXhUb2tlbigpO1xuXG4gICAgY29uc3QgW2Rvd25sb2FkXSA9IGF3YWl0IGRvd25sb2FkRGIuY3JlYXRlKHtcbiAgICAgIG9yZGVySWQsXG4gICAgICBwcm9kdWN0SWQsXG4gICAgICB2YXJpYW50SWQsXG4gICAgICB0b2tlbixcbiAgICAgIG1heERvd25sb2FkczogbnVsbCxcbiAgICAgIGRvd25sb2FkQ291bnQ6IDAsXG4gICAgICBleHBpcmVzQXQ6IG51bGwsXG4gICAgfSk7XG5cbiAgICBpZiAoIWRvd25sb2FkKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNTAwLCBcIkZhaWxlZCB0byBjcmVhdGUgZGlnaXRhbCBkb3dubG9hZCByZWNvcmRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvd25sb2FkO1xuICB9LFxuXG4gIGZpbmRCeU9yZGVySWQ6IGFzeW5jIChvcmRlcklkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gZG93bmxvYWREYi5maW5kQnlPcmRlcklkKG9yZGVySWQpO1xuICB9LFxuXG4gIHJlc29sdmVUb2tlbjogYXN5bmMgKHRva2VuOiBzdHJpbmcsIGlwOiBzdHJpbmcsIHVzZXJBZ2VudDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVjb3JkID0gYXdhaXQgZG93bmxvYWREYi5maW5kQnlUb2tlbih0b2tlbik7XG4gICAgaWYgKCFyZWNvcmQpIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiSW52YWxpZCBkb3dubG9hZCB0b2tlblwiKTtcblxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgZGIucXVlcnkub3JkZXJzLmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogZXEob3JkZXJzLmlkLCByZWNvcmQub3JkZXJJZCksXG4gICAgfSk7XG5cbiAgICBpZiAoIW9yZGVyKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIk9yZGVyIG5vdCBmb3VuZFwiKTtcblxuICAgIGlmIChvcmRlci5zdGF0dXMgPT09IFwiQ0FOQ0VMTEVEXCIpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiT3JkZXIgaXMgY2FuY2VsbGVkXCIpO1xuICAgIH1cblxuICAgIGlmIChvcmRlci5pc1JlZnVuZGVkKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIk9yZGVyIGhhcyBiZWVuIHJlZnVuZGVkXCIpO1xuICAgIH1cblxuICAgIGlmIChvcmRlci5zdGF0dXMgIT09IFwiUEFJRFwiKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIk9yZGVyIG5vdCBwYWlkXCIpO1xuICAgIH1cblxuICAgIGlmIChyZWNvcmQuZXhwaXJlc0F0ICYmIG5ldyBEYXRlKHJlY29yZC5leHBpcmVzQXQpIDwgbmV3IERhdGUoKSkge1xuICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDQwMCwgXCJEb3dubG9hZCB0b2tlbiBleHBpcmVkXCIpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHJlY29yZC5tYXhEb3dubG9hZHMgIT09IG51bGwgJiZcbiAgICAgIHJlY29yZC5kb3dubG9hZENvdW50ID49IHJlY29yZC5tYXhEb3dubG9hZHNcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDAsIFwiRG93bmxvYWQgbGltaXQgcmVhY2hlZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlTWVkaWEgPSBhd2FpdCBkYlxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuZnJvbShwcm9kdWN0TWVkaWEpXG4gICAgICAud2hlcmUoXG4gICAgICAgIGFuZChcbiAgICAgICAgICBlcShwcm9kdWN0TWVkaWEucHJvZHVjdElkLCByZWNvcmQucHJvZHVjdElkKSxcbiAgICAgICAgICBlcShwcm9kdWN0TWVkaWEudHlwZSwgXCJmaWxlXCIpXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICBpZiAoZmlsZU1lZGlhLmxlbmd0aCA9PT0gMCB8fCAhZmlsZU1lZGlhWzBdKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIk5vIGZpbGUgbWVkaWEgYXZhaWxhYmxlIGZvciB0aGlzIHByb2R1Y3RcIik7XG4gICAgfVxuXG4gICAgYXdhaXQgZG93bmxvYWREYi5pbmNyZW1lbnRDb3VudChyZWNvcmQuaWQpO1xuICAgIGF3YWl0IGRvd25sb2FkRGIubG9nQWNjZXNzKHtcbiAgICAgIGRpZ2l0YWxEb3dubG9hZElkOiByZWNvcmQuaWQsXG4gICAgICBpcEFkZHJlc3M6IGlwLFxuICAgICAgdXNlckFnZW50LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgdXJsOiBmaWxlTWVkaWFbMF0hLnVybCB9O1xuICB9LFxuXG4gIGxpc3RCeVByb2R1Y3Q6IGFzeW5jIChwcm9kdWN0SWQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBkb3dubG9hZERiLmxpc3RCeVByb2R1Y3RJZChwcm9kdWN0SWQpO1xuICB9LFxuXG4gIGxpc3RCeVByb2R1Y3RGb3JDcmVhdG9yOiBhc3luYyAodXNlcklkOiBzdHJpbmcsIHByb2R1Y3RJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbWVyY2hhbnQgPSBhd2FpdCBkYi5xdWVyeS5tZXJjaGFudHMuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiBlcShtZXJjaGFudHMudXNlcklkLCB1c2VySWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKCFtZXJjaGFudCkge1xuICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJNZXJjaGFudCBub3QgZm91bmQgZm9yIHRoaXMgdXNlclwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKHN0b3Jlcy5tZXJjaGFudElkLCBtZXJjaGFudC5pZCksXG4gICAgfSk7XG5cbiAgICBpZiAoIXN0b3JlKSB7XG4gICAgICB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIlN0b3JlIG5vdCBmb3VuZCBmb3IgdGhpcyBtZXJjaGFudFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9kdWN0ID0gYXdhaXQgZGIucXVlcnkucHJvZHVjdHMuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiBhbmQoXG4gICAgICAgIGVxKHByb2R1Y3RzLmlkLCBwcm9kdWN0SWQpLFxuICAgICAgICBlcShwcm9kdWN0cy5zdG9yZUlkLCBzdG9yZS5pZClcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBpZiAoIXByb2R1Y3QpIHtcbiAgICAgIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiUHJvZHVjdCBub3QgZm91bmRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvd25sb2FkRGIubGlzdEJ5UHJvZHVjdElkKHByb2R1Y3RJZCk7XG4gIH0sXG5cbiAgZ2V0VG9rZW5Gb3JVc2VyOiBhc3luYyAodXNlcjogeyBpZDogc3RyaW5nIH0sIG9yZGVySWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgZGIucXVlcnkub3JkZXJzLmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogZXEob3JkZXJzLmlkLCBvcmRlcklkKSxcbiAgICB9KTtcblxuICAgIGlmICghb3JkZXIpIHRocm93IG5ldyBBcGlFcnJvcig0MDQsIFwiT3JkZXIgbm90IGZvdW5kXCIpO1xuICAgIGlmIChvcmRlci5zdGF0dXMgIT09IFwiUEFJRFwiKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDAwLCBcIk9yZGVyIG5vdCBwYWlkXCIpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBhIGN1c3RvbWVyIHdobyBvd25zIHRoaXMgb3JkZXJcbiAgICBjb25zdCBjdXN0b21lciA9IGF3YWl0IGRiLnF1ZXJ5LmN1c3RvbWVycy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKGN1c3RvbWVycy51c2VySWQsIHVzZXIuaWQpLFxuICAgIH0pO1xuXG4gICAgaWYgKGN1c3RvbWVyICYmIG9yZGVyLmN1c3RvbWVySWQgPT09IGN1c3RvbWVyLmlkKSB7XG4gICAgICAvLyBVc2VyIGlzIGEgY3VzdG9tZXIgYW5kIG93bnMgdGhpcyBvcmRlclxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGEgbWVyY2hhbnQgd2hvIG93bnMgdGhlIHN0b3JlXG4gICAgICBjb25zdCBtZXJjaGFudCA9IGF3YWl0IGRiLnF1ZXJ5Lm1lcmNoYW50cy5maW5kRmlyc3Qoe1xuICAgICAgICB3aGVyZTogZXEobWVyY2hhbnRzLnVzZXJJZCwgdXNlci5pZCksXG4gICAgICB9KTtcblxuICAgICAgaWYgKG1lcmNoYW50KSB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBhd2FpdCBkYi5xdWVyeS5wcm9kdWN0cy5maW5kRmlyc3Qoe1xuICAgICAgICAgIHdoZXJlOiBlcShwcm9kdWN0cy5pZCwgb3JkZXIucHJvZHVjdElkKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcHJvZHVjdCkgdGhyb3cgbmV3IEFwaUVycm9yKDQwNCwgXCJQcm9kdWN0IG5vdCBmb3VuZFwiKTtcblxuICAgICAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGRiLnF1ZXJ5LnN0b3Jlcy5maW5kRmlyc3Qoe1xuICAgICAgICAgIHdoZXJlOiBlcShzdG9yZXMuaWQsIHByb2R1Y3Quc3RvcmVJZCksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXN0b3JlKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIlN0b3JlIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgaWYgKHN0b3JlLm1lcmNoYW50SWQgIT09IG1lcmNoYW50LmlkKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDAzLCBcIkZvcmJpZGRlblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgYWRtaW5cbiAgICAgICAgY29uc3QgYWRtaW5Vc2VySWRzID0gcHJvY2Vzcy5lbnYuQURNSU5fVVNFUl9JRFM/LnNwbGl0KCcsJykgfHwgW107XG4gICAgICAgIGlmICghYWRtaW5Vc2VySWRzLmluY2x1ZGVzKHVzZXIuaWQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEFwaUVycm9yKDQwMywgXCJGb3JiaWRkZW5cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IGRvd25sb2FkRGIuZmluZEJ5T3JkZXJJZChvcmRlcklkKTtcbiAgICBpZiAoIWRvd25sb2FkKSB0aHJvdyBuZXcgQXBpRXJyb3IoNDA0LCBcIkRvd25sb2FkIHRva2VuIG5vdCBmb3VuZFwiKTtcblxuICAgIHJldHVybiB7IHRva2VuOiBkb3dubG9hZC50b2tlbiB9O1xuICB9LFxuXG4gIGxpc3RBbGw6IGFzeW5jICgpID0+IHtcbiAgICByZXR1cm4gZG93bmxvYWREYi5saXN0QWxsKCk7XG4gIH0sXG59O1xuIl19