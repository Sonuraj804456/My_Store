"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuditService = void 0;
const admin_audit_db_1 = require("./admin-audit.db");
exports.adminAuditService = {
    async log(options) {
        const { adminId, action, entityType, entityId, metadata = {} } = options;
        await admin_audit_db_1.adminAuditDb.create({
            adminId,
            action,
            entityType,
            entityId,
            metadata,
        });
    },
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hZG1pbi9hZG1pbi1hdWRpdC5zZXJ2aWNlLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL2FkbWluL2FkbWluLWF1ZGl0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWdEO0FBRW5DLFFBQUEsaUJBQWlCLEdBQUc7SUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQU1UO1FBQ0MsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXpFLE1BQU0sNkJBQVksQ0FBQyxNQUFNLENBQUM7WUFDeEIsT0FBTztZQUNQLE1BQU07WUFDTixVQUFVO1lBQ1YsUUFBUTtZQUNSLFFBQVE7U0FDVCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFkbWluQXVkaXREYiB9IGZyb20gXCIuL2FkbWluLWF1ZGl0LmRiXCI7XG5cbmV4cG9ydCBjb25zdCBhZG1pbkF1ZGl0U2VydmljZSA9IHtcbiAgYXN5bmMgbG9nKG9wdGlvbnM6IHtcbiAgICBhZG1pbklkOiBzdHJpbmc7XG4gICAgYWN0aW9uOiBzdHJpbmc7XG4gICAgZW50aXR5VHlwZTogc3RyaW5nO1xuICAgIGVudGl0eUlkOiBzdHJpbmc7XG4gICAgbWV0YWRhdGE/OiBvYmplY3Q7XG4gIH0pIHtcbiAgICBjb25zdCB7IGFkbWluSWQsIGFjdGlvbiwgZW50aXR5VHlwZSwgZW50aXR5SWQsIG1ldGFkYXRhID0ge30gfSA9IG9wdGlvbnM7XG5cbiAgICBhd2FpdCBhZG1pbkF1ZGl0RGIuY3JlYXRlKHtcbiAgICAgIGFkbWluSWQsXG4gICAgICBhY3Rpb24sXG4gICAgICBlbnRpdHlUeXBlLFxuICAgICAgZW50aXR5SWQsXG4gICAgICBtZXRhZGF0YSxcbiAgICB9KTtcbiAgfSxcbn07XG4iXX0=