"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const env_1 = require("./env");
// schemas
const auth_schema_1 = require("../modules/auth/auth.schema");
const store_db_1 = require("../modules/stores/store.db");
const product_db_1 = require("../modules/products/product.db");
const order_db_1 = require("../modules/orders/order.db");
const payout_db_1 = require("../modules/payout/payout.db");
const download_db_1 = require("../modules/download/download.db");
const message_db_1 = require("../modules/messages/message.db");
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
});
exports.db = (0, node_postgres_1.drizzle)(pool, {
    schema: {
        user: auth_schema_1.user,
        merchants: auth_schema_1.merchants,
        customers: auth_schema_1.customers,
        session: auth_schema_1.session,
        account: auth_schema_1.account,
        verification: auth_schema_1.verification,
        userRelations: auth_schema_1.userRelations,
        merchantRelations: auth_schema_1.merchantRelations,
        customerRelations: auth_schema_1.customerRelations,
        sessionRelations: auth_schema_1.sessionRelations,
        accountRelations: auth_schema_1.accountRelations,
        stores: store_db_1.stores,
        products: product_db_1.products,
        categories: product_db_1.categories,
        productCategories: product_db_1.productCategories,
        productVariants: product_db_1.productVariants,
        productMedia: product_db_1.productMedia,
        orders: order_db_1.orders,
        payouts: payout_db_1.payouts,
        digitalDownloads: download_db_1.digitalDownloads,
        downloadLogs: download_db_1.downloadLogs,
        conversations: message_db_1.conversations,
        messages: message_db_1.messages,
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvY29uZmlnL2RiLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9jb25maWcvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQW9EO0FBQ3BELDJCQUEwQjtBQUMxQiwrQkFBNEI7QUFFNUIsVUFBVTtBQUNWLDZEQUFrTTtBQUNsTSx5REFBb0Q7QUFDcEQsK0RBQXdIO0FBQ3hILHlEQUFvRDtBQUNwRCwyREFBc0Q7QUFDdEQsaUVBQWlGO0FBQ2pGLCtEQUF5RTtBQUV6RSxNQUFNLElBQUksR0FBRyxJQUFJLFNBQUksQ0FBQztJQUNwQixnQkFBZ0IsRUFBRSxTQUFHLENBQUMsWUFBWTtDQUNuQyxDQUFDLENBQUM7QUFFVSxRQUFBLEVBQUUsR0FBRyxJQUFBLHVCQUFPLEVBQUMsSUFBSSxFQUFFO0lBQzlCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBSixrQkFBSTtRQUNKLFNBQVMsRUFBVCx1QkFBUztRQUNULFNBQVMsRUFBVCx1QkFBUztRQUNULE9BQU8sRUFBUCxxQkFBTztRQUNQLE9BQU8sRUFBUCxxQkFBTztRQUNQLFlBQVksRUFBWiwwQkFBWTtRQUNaLGFBQWEsRUFBYiwyQkFBYTtRQUNiLGlCQUFpQixFQUFqQiwrQkFBaUI7UUFDakIsaUJBQWlCLEVBQWpCLCtCQUFpQjtRQUNqQixnQkFBZ0IsRUFBaEIsOEJBQWdCO1FBQ2hCLGdCQUFnQixFQUFoQiw4QkFBZ0I7UUFDaEIsTUFBTSxFQUFOLGlCQUFNO1FBQ04sUUFBUSxFQUFSLHFCQUFRO1FBQ1IsVUFBVSxFQUFWLHVCQUFVO1FBQ1YsaUJBQWlCLEVBQWpCLDhCQUFpQjtRQUNqQixlQUFlLEVBQWYsNEJBQWU7UUFDZixZQUFZLEVBQVoseUJBQVk7UUFDWixNQUFNLEVBQU4saUJBQU07UUFDTixPQUFPLEVBQVAsbUJBQU87UUFDUCxnQkFBZ0IsRUFBaEIsOEJBQWdCO1FBQ2hCLFlBQVksRUFBWiwwQkFBWTtRQUNaLGFBQWEsRUFBYiwwQkFBYTtRQUNiLFFBQVEsRUFBUixxQkFBUTtLQUNUO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZHJpenpsZSB9IGZyb20gXCJkcml6emxlLW9ybS9ub2RlLXBvc3RncmVzXCI7XG5pbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5pbXBvcnQgeyBlbnYgfSBmcm9tIFwiLi9lbnZcIjtcblxuLy8gc2NoZW1hc1xuaW1wb3J0IHsgdXNlciwgbWVyY2hhbnRzLCBjdXN0b21lcnMsIHNlc3Npb24sIGFjY291bnQsIHZlcmlmaWNhdGlvbiwgdXNlclJlbGF0aW9ucywgbWVyY2hhbnRSZWxhdGlvbnMsIGN1c3RvbWVyUmVsYXRpb25zLCBzZXNzaW9uUmVsYXRpb25zLCBhY2NvdW50UmVsYXRpb25zIH0gZnJvbSBcIi4uL21vZHVsZXMvYXV0aC9hdXRoLnNjaGVtYVwiO1xuaW1wb3J0IHsgc3RvcmVzIH0gZnJvbSBcIi4uL21vZHVsZXMvc3RvcmVzL3N0b3JlLmRiXCI7XG5pbXBvcnQgeyBwcm9kdWN0cywgY2F0ZWdvcmllcywgcHJvZHVjdENhdGVnb3JpZXMsIHByb2R1Y3RWYXJpYW50cywgcHJvZHVjdE1lZGlhIH0gZnJvbSBcIi4uL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5kYlwiO1xuaW1wb3J0IHsgb3JkZXJzIH0gZnJvbSBcIi4uL21vZHVsZXMvb3JkZXJzL29yZGVyLmRiXCI7XG5pbXBvcnQgeyBwYXlvdXRzIH0gZnJvbSBcIi4uL21vZHVsZXMvcGF5b3V0L3BheW91dC5kYlwiO1xuaW1wb3J0IHsgZGlnaXRhbERvd25sb2FkcywgZG93bmxvYWRMb2dzIH0gZnJvbSBcIi4uL21vZHVsZXMvZG93bmxvYWQvZG93bmxvYWQuZGJcIjtcbmltcG9ydCB7IGNvbnZlcnNhdGlvbnMsIG1lc3NhZ2VzIH0gZnJvbSBcIi4uL21vZHVsZXMvbWVzc2FnZXMvbWVzc2FnZS5kYlwiO1xuXG5jb25zdCBwb29sID0gbmV3IFBvb2woe1xuICBjb25uZWN0aW9uU3RyaW5nOiBlbnYuREFUQUJBU0VfVVJMLFxufSk7XG5cbmV4cG9ydCBjb25zdCBkYiA9IGRyaXp6bGUocG9vbCwge1xuICBzY2hlbWE6IHtcbiAgICB1c2VyLFxuICAgIG1lcmNoYW50cyxcbiAgICBjdXN0b21lcnMsXG4gICAgc2Vzc2lvbixcbiAgICBhY2NvdW50LFxuICAgIHZlcmlmaWNhdGlvbixcbiAgICB1c2VyUmVsYXRpb25zLFxuICAgIG1lcmNoYW50UmVsYXRpb25zLFxuICAgIGN1c3RvbWVyUmVsYXRpb25zLFxuICAgIHNlc3Npb25SZWxhdGlvbnMsXG4gICAgYWNjb3VudFJlbGF0aW9ucyxcbiAgICBzdG9yZXMsXG4gICAgcHJvZHVjdHMsXG4gICAgY2F0ZWdvcmllcyxcbiAgICBwcm9kdWN0Q2F0ZWdvcmllcyxcbiAgICBwcm9kdWN0VmFyaWFudHMsXG4gICAgcHJvZHVjdE1lZGlhLFxuICAgIG9yZGVycyxcbiAgICBwYXlvdXRzLFxuICAgIGRpZ2l0YWxEb3dubG9hZHMsXG4gICAgZG93bmxvYWRMb2dzLFxuICAgIGNvbnZlcnNhdGlvbnMsXG4gICAgbWVzc2FnZXMsXG4gIH0sXG59KTsiXX0=