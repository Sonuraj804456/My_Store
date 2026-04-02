"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stores = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.stores = (0, pg_core_1.pgTable)("stores", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id", { length: 255 })
        .notNull()
        .unique(), // one store per user
    username: (0, pg_core_1.varchar)("username", { length: 30 })
        .notNull()
        .unique(),
    name: (0, pg_core_1.varchar)("name", { length: 80 })
        .notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 500 }),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    bannerUrl: (0, pg_core_1.text)("banner_url"),
    isPublic: (0, pg_core_1.boolean)("is_public")
        .notNull()
        .default(false),
    isVacationMode: (0, pg_core_1.boolean)("is_vacation_mode")
        .notNull()
        .default(false),
    isSuspended: (0, pg_core_1.boolean)("is_suspended")
        .notNull()
        .default(false),
    suspensionReason: (0, pg_core_1.text)("suspension_reason"),
    suspendedAt: (0, pg_core_1.timestamp)("suspended_at", { withTimezone: true }),
    announcementText: (0, pg_core_1.varchar)("announcement_text", { length: 200 }),
    announcementEnabled: (0, pg_core_1.boolean)("announcement_enabled")
        .notNull()
        .default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at", { withTimezone: true }),
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuZGIudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL21vZHVsZXMvc3RvcmVzL3N0b3JlLmRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQU82QjtBQUM3Qiw2Q0FBa0M7QUFFckIsUUFBQSxNQUFNLEdBQUcsSUFBQSxpQkFBTyxFQUFDLFFBQVEsRUFBRTtJQUN0QyxFQUFFLEVBQUUsSUFBQSxjQUFJLEVBQUMsSUFBSSxDQUFDO1NBQ1gsVUFBVSxFQUFFO1NBQ1osT0FBTyxDQUFDLElBQUEsaUJBQUcsRUFBQSxtQkFBbUIsQ0FBQztJQUVsQyxNQUFNLEVBQUUsSUFBQSxpQkFBTyxFQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN4QyxPQUFPLEVBQUU7U0FDVCxNQUFNLEVBQUUsRUFBRSxxQkFBcUI7SUFFbEMsUUFBUSxFQUFFLElBQUEsaUJBQU8sRUFBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDMUMsT0FBTyxFQUFFO1NBQ1QsTUFBTSxFQUFFO0lBRVgsSUFBSSxFQUFFLElBQUEsaUJBQU8sRUFBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDbEMsT0FBTyxFQUFFO0lBRVosV0FBVyxFQUFFLElBQUEsaUJBQU8sRUFBQyxhQUFhLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFFcEQsU0FBUyxFQUFFLElBQUEsY0FBSSxFQUFDLFlBQVksQ0FBQztJQUM3QixTQUFTLEVBQUUsSUFBQSxjQUFJLEVBQUMsWUFBWSxDQUFDO0lBRTdCLFFBQVEsRUFBRSxJQUFBLGlCQUFPLEVBQUMsV0FBVyxDQUFDO1NBQzNCLE9BQU8sRUFBRTtTQUNULE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFFakIsY0FBYyxFQUFFLElBQUEsaUJBQU8sRUFBQyxrQkFBa0IsQ0FBQztTQUN4QyxPQUFPLEVBQUU7U0FDVCxPQUFPLENBQUMsS0FBSyxDQUFDO0lBRWpCLFdBQVcsRUFBRSxJQUFBLGlCQUFPLEVBQUMsY0FBYyxDQUFDO1NBQ2pDLE9BQU8sRUFBRTtTQUNULE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFFakIsZ0JBQWdCLEVBQUUsSUFBQSxjQUFJLEVBQUMsbUJBQW1CLENBQUM7SUFDM0MsV0FBVyxFQUFFLElBQUEsbUJBQVMsRUFBQyxjQUFjLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFFOUQsZ0JBQWdCLEVBQUUsSUFBQSxpQkFBTyxFQUFDLG1CQUFtQixFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBRS9ELG1CQUFtQixFQUFFLElBQUEsaUJBQU8sRUFBQyxzQkFBc0IsQ0FBQztTQUNqRCxPQUFPLEVBQUU7U0FDVCxPQUFPLENBQUMsS0FBSyxDQUFDO0lBRWpCLFNBQVMsRUFBRSxJQUFBLG1CQUFTLEVBQUMsWUFBWSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3ZELE9BQU8sRUFBRTtTQUNULFVBQVUsRUFBRTtJQUVmLFNBQVMsRUFBRSxJQUFBLG1CQUFTLEVBQUMsWUFBWSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3ZELE9BQU8sRUFBRTtTQUNULFVBQVUsRUFBRTtJQUVmLFNBQVMsRUFBRSxJQUFBLG1CQUFTLEVBQUMsWUFBWSxFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO0NBQzNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHBnVGFibGUsXG4gIHV1aWQsXG4gIHZhcmNoYXIsXG4gIHRleHQsXG4gIGJvb2xlYW4sXG4gIHRpbWVzdGFtcCxcbn0gZnJvbSBcImRyaXp6bGUtb3JtL3BnLWNvcmVcIjtcbmltcG9ydCB7IHNxbCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuXG5leHBvcnQgY29uc3Qgc3RvcmVzID0gcGdUYWJsZShcInN0b3Jlc1wiLCB7XG4gIGlkOiB1dWlkKFwiaWRcIilcbiAgICAucHJpbWFyeUtleSgpXG4gICAgLmRlZmF1bHQoc3FsYGdlbl9yYW5kb21fdXVpZCgpYCksXG5cbiAgdXNlcklkOiB2YXJjaGFyKFwidXNlcl9pZFwiLCB7IGxlbmd0aDogMjU1IH0pXG4gICAgLm5vdE51bGwoKVxuICAgIC51bmlxdWUoKSwgLy8gb25lIHN0b3JlIHBlciB1c2VyXG5cbiAgdXNlcm5hbWU6IHZhcmNoYXIoXCJ1c2VybmFtZVwiLCB7IGxlbmd0aDogMzAgfSlcbiAgICAubm90TnVsbCgpXG4gICAgLnVuaXF1ZSgpLFxuXG4gIG5hbWU6IHZhcmNoYXIoXCJuYW1lXCIsIHsgbGVuZ3RoOiA4MCB9KVxuICAgIC5ub3ROdWxsKCksXG5cbiAgZGVzY3JpcHRpb246IHZhcmNoYXIoXCJkZXNjcmlwdGlvblwiLCB7IGxlbmd0aDogNTAwIH0pLFxuXG4gIGF2YXRhclVybDogdGV4dChcImF2YXRhcl91cmxcIiksXG4gIGJhbm5lclVybDogdGV4dChcImJhbm5lcl91cmxcIiksXG5cbiAgaXNQdWJsaWM6IGJvb2xlYW4oXCJpc19wdWJsaWNcIilcbiAgICAubm90TnVsbCgpXG4gICAgLmRlZmF1bHQoZmFsc2UpLFxuXG4gIGlzVmFjYXRpb25Nb2RlOiBib29sZWFuKFwiaXNfdmFjYXRpb25fbW9kZVwiKVxuICAgIC5ub3ROdWxsKClcbiAgICAuZGVmYXVsdChmYWxzZSksXG5cbiAgaXNTdXNwZW5kZWQ6IGJvb2xlYW4oXCJpc19zdXNwZW5kZWRcIilcbiAgICAubm90TnVsbCgpXG4gICAgLmRlZmF1bHQoZmFsc2UpLFxuXG4gIHN1c3BlbnNpb25SZWFzb246IHRleHQoXCJzdXNwZW5zaW9uX3JlYXNvblwiKSxcbiAgc3VzcGVuZGVkQXQ6IHRpbWVzdGFtcChcInN1c3BlbmRlZF9hdFwiLCB7IHdpdGhUaW1lem9uZTogdHJ1ZSB9KSxcblxuICBhbm5vdW5jZW1lbnRUZXh0OiB2YXJjaGFyKFwiYW5ub3VuY2VtZW50X3RleHRcIiwgeyBsZW5ndGg6IDIwMCB9KSxcblxuICBhbm5vdW5jZW1lbnRFbmFibGVkOiBib29sZWFuKFwiYW5ub3VuY2VtZW50X2VuYWJsZWRcIilcbiAgICAubm90TnVsbCgpXG4gICAgLmRlZmF1bHQoZmFsc2UpLFxuXG4gIGNyZWF0ZWRBdDogdGltZXN0YW1wKFwiY3JlYXRlZF9hdFwiLCB7IHdpdGhUaW1lem9uZTogdHJ1ZSB9KVxuICAgIC5ub3ROdWxsKClcbiAgICAuZGVmYXVsdE5vdygpLFxuXG4gIHVwZGF0ZWRBdDogdGltZXN0YW1wKFwidXBkYXRlZF9hdFwiLCB7IHdpdGhUaW1lem9uZTogdHJ1ZSB9KVxuICAgIC5ub3ROdWxsKClcbiAgICAuZGVmYXVsdE5vdygpLFxuXG4gIGRlbGV0ZWRBdDogdGltZXN0YW1wKFwiZGVsZXRlZF9hdFwiLCB7IHdpdGhUaW1lem9uZTogdHJ1ZSB9KSxcbn0pOyJdfQ==