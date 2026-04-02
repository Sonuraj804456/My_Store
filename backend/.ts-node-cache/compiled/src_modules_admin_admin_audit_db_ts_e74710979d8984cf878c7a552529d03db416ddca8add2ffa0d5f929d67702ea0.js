"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuditDb = exports.adminAuditLogs = void 0;
const db_1 = require("../../config/db");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.adminAuditLogs = (0, pg_core_1.pgTable)("admin_audit_logs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    adminId: (0, pg_core_1.varchar)("admin_id", { length: 255 }).notNull(),
    action: (0, pg_core_1.varchar)("action", { length: 120 }).notNull(),
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 80 }).notNull(),
    entityId: (0, pg_core_1.varchar)("entity_id", { length: 255 }).notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.adminAuditDb = {
    create: async (data) => {
        if (!db_1.db.insert) {
            // In tests we may mock db without insert.
            return [];
        }
        return db_1.db
            .insert(exports.adminAuditLogs)
            .values(data)
            .returning();
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hZG1pbi9hZG1pbi1hdWRpdC5kYi50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9hZG1pbi9hZG1pbi1hdWRpdC5kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBcUM7QUFDckMsaURBQXFGO0FBRXhFLFFBQUEsY0FBYyxHQUFHLElBQUEsaUJBQU8sRUFBQyxrQkFBa0IsRUFBRTtJQUN4RCxFQUFFLEVBQUUsSUFBQSxjQUFJLEVBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNDLE9BQU8sRUFBRSxJQUFBLGlCQUFPLEVBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ3ZELE1BQU0sRUFBRSxJQUFBLGlCQUFPLEVBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ3BELFVBQVUsRUFBRSxJQUFBLGlCQUFPLEVBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQzVELFFBQVEsRUFBRSxJQUFBLGlCQUFPLEVBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFO0lBQ3pELFFBQVEsRUFBRSxJQUFBLGVBQUssRUFBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQ3ZDLFNBQVMsRUFBRSxJQUFBLG1CQUFTLEVBQUMsWUFBWSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxFQUFFO0NBQ2xGLENBQUMsQ0FBQztBQUVVLFFBQUEsWUFBWSxHQUFHO0lBQzFCLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBUyxFQUFFLEVBQUU7UUFDMUIsSUFBSSxDQUFFLE9BQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QiwwQ0FBMEM7WUFDMUMsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsT0FBUSxPQUFVO2FBQ2YsTUFBTSxDQUFDLHNCQUFjLENBQUM7YUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQzthQUNaLFNBQVMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGIgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2RiXCI7XG5pbXBvcnQgeyBwZ1RhYmxlLCB1dWlkLCB2YXJjaGFyLCB0ZXh0LCBqc29uYiwgdGltZXN0YW1wIH0gZnJvbSBcImRyaXp6bGUtb3JtL3BnLWNvcmVcIjtcblxuZXhwb3J0IGNvbnN0IGFkbWluQXVkaXRMb2dzID0gcGdUYWJsZShcImFkbWluX2F1ZGl0X2xvZ3NcIiwge1xuICBpZDogdXVpZChcImlkXCIpLmRlZmF1bHRSYW5kb20oKS5wcmltYXJ5S2V5KCksXG4gIGFkbWluSWQ6IHZhcmNoYXIoXCJhZG1pbl9pZFwiLCB7IGxlbmd0aDogMjU1IH0pLm5vdE51bGwoKSxcbiAgYWN0aW9uOiB2YXJjaGFyKFwiYWN0aW9uXCIsIHsgbGVuZ3RoOiAxMjAgfSkubm90TnVsbCgpLFxuICBlbnRpdHlUeXBlOiB2YXJjaGFyKFwiZW50aXR5X3R5cGVcIiwgeyBsZW5ndGg6IDgwIH0pLm5vdE51bGwoKSxcbiAgZW50aXR5SWQ6IHZhcmNoYXIoXCJlbnRpdHlfaWRcIiwgeyBsZW5ndGg6IDI1NSB9KS5ub3ROdWxsKCksXG4gIG1ldGFkYXRhOiBqc29uYihcIm1ldGFkYXRhXCIpLmRlZmF1bHQoe30pLFxuICBjcmVhdGVkQXQ6IHRpbWVzdGFtcChcImNyZWF0ZWRfYXRcIiwgeyB3aXRoVGltZXpvbmU6IHRydWUgfSkuZGVmYXVsdE5vdygpLm5vdE51bGwoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYWRtaW5BdWRpdERiID0ge1xuICBjcmVhdGU6IGFzeW5jIChkYXRhOiBhbnkpID0+IHtcbiAgICBpZiAoIShkYiBhcyBhbnkpLmluc2VydCkge1xuICAgICAgLy8gSW4gdGVzdHMgd2UgbWF5IG1vY2sgZGIgd2l0aG91dCBpbnNlcnQuXG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIChkYiBhcyBhbnkpXG4gICAgICAuaW5zZXJ0KGFkbWluQXVkaXRMb2dzKVxuICAgICAgLnZhbHVlcyhkYXRhKVxuICAgICAgLnJldHVybmluZygpO1xuICB9LFxufTtcbiJdfQ==