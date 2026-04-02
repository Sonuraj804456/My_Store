"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspendStoreSchema = exports.updateStoreSchema = exports.createStoreSchema = void 0;
const zod_1 = require("zod");
const usernameRegex = /^[a-z0-9-]+$/;
exports.createStoreSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3)
        .max(30)
        .regex(usernameRegex, "Only lowercase letters, numbers, and hyphens allowed"),
    name: zod_1.z
        .string()
        .min(1)
        .max(80),
    description: zod_1.z
        .string()
        .max(500)
        .nullable()
        .optional(),
    avatarUrl: zod_1.z
        .string()
        .url()
        .nullable()
        .optional(),
    bannerUrl: zod_1.z
        .string()
        .url()
        .nullable()
        .optional(),
});
exports.updateStoreSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1)
        .max(80)
        .optional(),
    description: zod_1.z
        .string()
        .max(500)
        .optional(),
    avatarUrl: zod_1.z
        .string()
        .url()
        .optional(),
    bannerUrl: zod_1.z
        .string()
        .url()
        .optional(),
    isPublic: zod_1.z
        .boolean()
        .optional(),
    isVacationMode: zod_1.z
        .boolean()
        .optional(),
    announcementText: zod_1.z
        .string()
        .max(200)
        .nullable()
        .optional(),
    announcementEnabled: zod_1.z
        .boolean()
        .optional(),
});
exports.suspendStoreSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5).max(300),
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuc2NoZW1hLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXdCO0FBRXhCLE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQztBQUV4QixRQUFBLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEMsUUFBUSxFQUFFLE9BQUM7U0FDUixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUNQLEtBQUssQ0FBQyxhQUFhLEVBQUUsc0RBQXNELENBQUM7SUFFL0UsSUFBSSxFQUFFLE9BQUM7U0FDSixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUVWLFdBQVcsRUFBRSxPQUFDO1NBQ1gsTUFBTSxFQUFFO1NBQ1IsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUNSLFFBQVEsRUFBRTtTQUNWLFFBQVEsRUFBRTtJQUViLFNBQVMsRUFBRSxPQUFDO1NBQ1QsTUFBTSxFQUFFO1NBQ1IsR0FBRyxFQUFFO1NBQ0wsUUFBUSxFQUFFO1NBQ1YsUUFBUSxFQUFFO0lBRWIsU0FBUyxFQUFFLE9BQUM7U0FDVCxNQUFNLEVBQUU7U0FDUixHQUFHLEVBQUU7U0FDTCxRQUFRLEVBQUU7U0FDVixRQUFRLEVBQUU7Q0FFZCxDQUFDLENBQUM7QUFFVSxRQUFBLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEMsSUFBSSxFQUFFLE9BQUM7U0FDSixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUNQLFFBQVEsRUFBRTtJQUViLFdBQVcsRUFBRSxPQUFDO1NBQ1gsTUFBTSxFQUFFO1NBQ1IsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUNSLFFBQVEsRUFBRTtJQUViLFNBQVMsRUFBRSxPQUFDO1NBQ1QsTUFBTSxFQUFFO1NBQ1IsR0FBRyxFQUFFO1NBQ0wsUUFBUSxFQUFFO0lBRWIsU0FBUyxFQUFFLE9BQUM7U0FDVCxNQUFNLEVBQUU7U0FDUixHQUFHLEVBQUU7U0FDTCxRQUFRLEVBQUU7SUFFYixRQUFRLEVBQUUsT0FBQztTQUNSLE9BQU8sRUFBRTtTQUNULFFBQVEsRUFBRTtJQUViLGNBQWMsRUFBRSxPQUFDO1NBQ2QsT0FBTyxFQUFFO1NBQ1QsUUFBUSxFQUFFO0lBRWIsZ0JBQWdCLEVBQUUsT0FBQztTQUNoQixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsR0FBRyxDQUFDO1NBQ1IsUUFBUSxFQUFFO1NBQ1YsUUFBUSxFQUFFO0lBRWIsbUJBQW1CLEVBQUUsT0FBQztTQUNuQixPQUFPLEVBQUU7U0FDVCxRQUFRLEVBQUU7Q0FDZCxDQUFDLENBQUM7QUFFVSxRQUFBLGtCQUFrQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDekMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztDQUNuQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuXG5jb25zdCB1c2VybmFtZVJlZ2V4ID0gL15bYS16MC05LV0rJC87XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgdXNlcm5hbWU6IHpcbiAgICAuc3RyaW5nKClcbiAgICAubWluKDMpXG4gICAgLm1heCgzMClcbiAgICAucmVnZXgodXNlcm5hbWVSZWdleCwgXCJPbmx5IGxvd2VyY2FzZSBsZXR0ZXJzLCBudW1iZXJzLCBhbmQgaHlwaGVucyBhbGxvd2VkXCIpLFxuXG4gIG5hbWU6IHpcbiAgICAuc3RyaW5nKClcbiAgICAubWluKDEpXG4gICAgLm1heCg4MCksXG5cbiAgZGVzY3JpcHRpb246IHpcbiAgICAuc3RyaW5nKClcbiAgICAubWF4KDUwMClcbiAgICAubnVsbGFibGUoKVxuICAgIC5vcHRpb25hbCgpLFxuXG4gIGF2YXRhclVybDogelxuICAgIC5zdHJpbmcoKVxuICAgIC51cmwoKVxuICAgIC5udWxsYWJsZSgpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgYmFubmVyVXJsOiB6XG4gICAgLnN0cmluZygpXG4gICAgLnVybCgpXG4gICAgLm51bGxhYmxlKClcbiAgICAub3B0aW9uYWwoKSxcblxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVTdG9yZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgbmFtZTogelxuICAgIC5zdHJpbmcoKVxuICAgIC5taW4oMSlcbiAgICAubWF4KDgwKVxuICAgIC5vcHRpb25hbCgpLFxuXG4gIGRlc2NyaXB0aW9uOiB6XG4gICAgLnN0cmluZygpXG4gICAgLm1heCg1MDApXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgYXZhdGFyVXJsOiB6XG4gICAgLnN0cmluZygpXG4gICAgLnVybCgpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgYmFubmVyVXJsOiB6XG4gICAgLnN0cmluZygpXG4gICAgLnVybCgpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgaXNQdWJsaWM6IHpcbiAgICAuYm9vbGVhbigpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgaXNWYWNhdGlvbk1vZGU6IHpcbiAgICAuYm9vbGVhbigpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgYW5ub3VuY2VtZW50VGV4dDogelxuICAgIC5zdHJpbmcoKVxuICAgIC5tYXgoMjAwKVxuICAgIC5udWxsYWJsZSgpXG4gICAgLm9wdGlvbmFsKCksXG5cbiAgYW5ub3VuY2VtZW50RW5hYmxlZDogelxuICAgIC5ib29sZWFuKClcbiAgICAub3B0aW9uYWwoKSxcbn0pO1xuXG5leHBvcnQgY29uc3Qgc3VzcGVuZFN0b3JlU2NoZW1hID0gei5vYmplY3Qoe1xuICByZWFzb246IHouc3RyaW5nKCkubWluKDUpLm1heCgzMDApLFxufSk7XG4iXX0=