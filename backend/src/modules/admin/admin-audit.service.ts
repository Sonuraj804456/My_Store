import { adminAuditDb } from "./admin-audit.db";

export const adminAuditService = {
  async log(options: {
    adminId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: object;
  }) {
    const { adminId, action, entityType, entityId, metadata = {} } = options;

    await adminAuditDb.create({
      adminId,
      action,
      entityType,
      entityId,
      metadata,
    });
  },
};
