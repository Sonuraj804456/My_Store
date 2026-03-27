import { stores } from "./store.db";
import { payouts } from "../payout/payout.db";
import { and, eq, isNull, not } from "drizzle-orm";
import { ApiError } from "../shared/api-error";
import { db } from "../../config/db";
import { adminAuditService } from "../admin/admin-audit.service";

export async function createStore(
  userId: string,
  data: {
    username: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
  }
) {
  const existingStore = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (existingStore) {
    throw new ApiError(409, "User already owns a store");
  }

  const usernameTaken = await db.query.stores.findFirst({
    where: eq(stores.username, data.username),
  });

  if (usernameTaken) {
    throw new ApiError(409, "Username already taken");
  }

  try {
    const [store] = await db
      .insert(stores)
      .values({
        userId,
        ...data,
      })
      .returning();

    return store;
  } catch (err: any) {
    // Postgres unique violation
    // err.code === '23505' is the Postgres unique_violation code
    const constraint = err.constraint || "";
    if (err && (err.code === "23505" || /unique/i.test(err.message || ""))) {
      if (constraint.includes("username") || (err.detail && err.detail.includes("username"))) {
        throw new ApiError(409, "Username already taken");
      }
      if (constraint.includes("user_id") || (err.detail && err.detail.includes("user_id"))) {
        throw new ApiError(409, "User already owns a store");
      }
      // Generic unique violation fallback
      throw new ApiError(409, "Unique constraint violation");
    }

    throw err;
  }
}

export async function getOwnStore(userId: string) {
  const store = await db.query.stores.findFirst({
    where: and(
      eq(stores.userId, userId),
      isNull(stores.deletedAt)
    ),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  return store;
}

export async function updateOwnStore(
  userId: string,
  updates: Partial<{
    name: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    isPublic: boolean;
    isVacationMode: boolean;
    announcementText?: string;
    announcementEnabled: boolean;
  }>
) {
  const store = await db.query.stores.findFirst({
    where: and(
      eq(stores.userId, userId),
      isNull(stores.deletedAt)
    ),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  // Optionally, owners may still update store metadata while suspended (admin handles business logic elsewhere).
  try {
    const [updated] = await db
      .update(stores)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, store.id))
      .returning();

    return updated;
  } catch (err: any) {
    const constraint = err.constraint || "";
    if (err && (err.code === "23505" || /unique/i.test(err.message || ""))) {
      if (constraint.includes("username") || (err.detail && err.detail.includes("username"))) {
        throw new ApiError(409, "Username already taken");
      }
      if (constraint.includes("user_id") || (err.detail && err.detail.includes("user_id"))) {
        throw new ApiError(409, "User already owns a store");
      }
      throw new ApiError(409, "Unique constraint violation");
    }

    throw err;
  }

}

export async function softDeleteStore(userId: string) {
  const store = await db.query.stores.findFirst({
    where: and(
      eq(stores.userId, userId),
      isNull(stores.deletedAt)
    ),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  let payoutExists = null;
  try {
    payoutExists = await db.query.payouts.findFirst({
      where: eq(payouts.storeId, store.id),
    });
  } catch {
    payoutExists = null;
  }

  if (payoutExists) {
    throw new ApiError(400, "Cannot delete store with existing payouts");
  }

  await db
    .update(stores)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(stores.id, store.id));
}

export async function getPublicStoreByUsername(username: string) {
  const store = await db.query.stores.findFirst({
    where: and(
      eq(stores.username, username),
      eq(stores.isPublic, true),
      isNull(stores.deletedAt)
    ),
  });

  if (!store || store.isSuspended) {
    throw new ApiError(404, "Store not found");
  }

  return {
    username: store.username,
    name: store.name,
    description: store.description,
    avatarUrl: store.avatarUrl,
    bannerUrl: store.bannerUrl,
    announcementText: store.announcementText,
    announcementEnabled: store.announcementEnabled,
    isVacationMode: store.isVacationMode,
  };
}

export async function adminListStores() {
  return db.query.stores.findMany();
}

export async function adminGetStoreById(storeId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  return store;
}

export async function adminSuspendStore(storeId: string, reason: string, adminId = "system") {
  const store = await db.query.stores.findFirst({ where: eq(stores.id, storeId) });
  if (!store) throw new ApiError(404, "Store not found");

  if (store.isSuspended) {
    throw new ApiError(400, "Store already suspended");
  }

  const [updated] = await db
    .update(stores)
    .set({
      isSuspended: true,
      suspensionReason: reason,
      suspendedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  await adminAuditService.log({
    adminId,
    action: "suspend_store",
    entityType: "store",
    entityId: storeId,
    metadata: { reason },
  });

  return updated;
}

export async function adminUnsuspendStore(storeId: string, adminId = "system") {
  const store = await db.query.stores.findFirst({ where: eq(stores.id, storeId) });
  if (!store) throw new ApiError(404, "Store not found");

  if (!store.isSuspended) {
    throw new ApiError(400, "Store is not suspended");
  }

  const [updated] = await db
    .update(stores)
    .set({
      isSuspended: false,
      suspensionReason: null,
      suspendedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  await adminAuditService.log({
    adminId,
    action: "unsuspend_store",
    entityType: "store",
    entityId: storeId,
    metadata: {},
  });

  return updated;
}

export async function adminRestoreStore(storeId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  if (!store.deletedAt) {
    throw new ApiError(400, "Store is not deleted");
  }

  const existing = await db.query.stores.findFirst({
    where: and(
      eq(stores.username, store.username),
      isNull(stores.deletedAt),
      not(eq(stores.id, storeId))
    ),
  });

  if (existing) {
    throw new ApiError(400, "Cannot restore store: username conflict");
  }

  const [restored] = await db
    .update(stores)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  await adminAuditService.log({
    adminId: "system",
    action: "restore_store",
    entityType: "store",
    entityId: storeId,
    metadata: { username: store.username },
  });

  return restored;
}

