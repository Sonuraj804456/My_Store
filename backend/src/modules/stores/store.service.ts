import { stores } from "./store.db";
import { and, eq, isNull } from "drizzle-orm";
import { ApiError } from "../shared/api-error";
import { db } from "../../config/db";

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

  const [store] = await db
    .insert(stores)
    .values({
      userId,
      ...data,
    })
    .returning();

  return store;
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

  const [updated] = await db
    .update(stores)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, store.id))
    .returning();

  return updated;
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

  if (!store) {
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

  const [restored] = await db
    .update(stores)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId))
    .returning();

  return restored;
}

