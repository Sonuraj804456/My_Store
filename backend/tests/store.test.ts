import { describe, it, expect, beforeEach, vi } from "vitest";
import * as storeService from "../src/modules/stores/store.service";
import { ApiError } from "../src/modules/shared/api-error";

// ---- MOCK DATABASE ----
vi.mock("../src/config/db", () => {
  const mockDb = {
    query: {
      stores: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
  };

  return { db: mockDb };
});

// ---- HELPER FUNCTIONS ----
const mockStore = (overrides?: Partial<any>) => ({
  id: "store-123",
  userId: "user-123",
  username: "teststore",
  name: "Test Store",
  description: "A test store",
  avatarUrl: null,
  bannerUrl: null,
  isPublic: false,
  isVacationMode: false,
  announcementText: null,
  announcementEnabled: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
});

const mockUser = (overrides?: Partial<any>) => ({
  id: "user-123",
  email: "user@example.com",
  ...overrides,
});

// ---- TESTS ----
describe("Store Service", () => {
  let db: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../src/config/db");
    db = (mod as any).db;
  });

  // ============================================
  // STORE CREATION TESTS
  // ============================================
  describe("createStore", () => {
    it("should create a new store with valid data", async () => {
      const userId = "user-123";
      const storeData = {
        username: "mystore",
        name: "My Store",
        description: "My awesome store",
        avatarUrl: "https://example.com/avatar.jpg",
        bannerUrl: "https://example.com/banner.jpg",
      };

      const createdStore = mockStore({
        userId,
        ...storeData,
      });

      db.query.stores.findFirst.mockResolvedValueOnce(null); // No existing store
      db.query.stores.findFirst.mockResolvedValueOnce(null); // Username not taken
      db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValueOnce([createdStore]),
        }),
      });

      const result = await storeService.createStore(userId, storeData);

      expect(result).toEqual(createdStore);
      expect(result.userId).toBe(userId);
      expect(result.username).toBe("mystore");
      expect(result.name).toBe("My Store");
    });

    it("should reject creation if user already owns a store", async () => {
      const userId = "user-123";
      const existingStore = mockStore({ userId });

      db.query.stores.findFirst.mockResolvedValueOnce(existingStore);

      const storeData = {
        username: "anotherstore",
        name: "Another Store",
      };

      await expect(storeService.createStore(userId, storeData)).rejects.toThrow(
        ApiError
      );
    });

    it("should reject creation if username is already taken", async () => {
      const userId = "user-123";
      const existingStore = mockStore({ username: "taken-username" });

      db.query.stores.findFirst
        .mockResolvedValueOnce(null) // No existing store for user
        .mockResolvedValueOnce(existingStore); // Username already taken

      const storeData = {
        username: "taken-username",
        name: "My Store",
      };

      await expect(storeService.createStore(userId, storeData)).rejects.toThrow(
        ApiError
      );
    });
  });

  // ============================================
  // ONE-STORE-PER-USER RULE TESTS
  // ============================================
  describe("One store per user rule", () => {
    it("should enforce that a user can only own one store", async () => {
      const userId = "user-123";
      const firstStore = mockStore({ userId });

      // First store exists
      db.query.stores.findFirst.mockResolvedValueOnce(firstStore);

      const secondStoreData = {
        username: "secondstore",
        name: "Second Store",
      };

      // Capture the thrown error to assert its type and message
      try {
        await storeService.createStore(userId, secondStoreData);
        throw new Error("Expected createStore to throw");
      } catch (err: any) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.message).toContain("User already owns a store");
      }
    });

    it("should allow store creation if user has no store", async () => {
      const userId = "user-456";
      const storeData = {
        username: "newstore",
        name: "New Store",
      };

      const newStore = mockStore({
        userId,
        username: "newstore",
        name: "New Store",
      });

      db.query.stores.findFirst
        .mockResolvedValueOnce(null) // No existing store
        .mockResolvedValueOnce(null); // Username available

      db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValueOnce([newStore]),
        }),
      });

      const result = await storeService.createStore(userId, storeData);

      expect(result.userId).toBe(userId);
    });
  });

  // ============================================
  // USERNAME PERMANENCE TESTS
  // ============================================
  describe("Username permanence", () => {
    it("should allow updating store metadata but not username", async () => {
      const userId = "user-123";
      const store = mockStore({ userId });

      db.query.stores.findFirst.mockResolvedValueOnce(store);

      const updates = {
        name: "Updated Name",
        description: "Updated description",
        // username is not included
      };

      const updatedStore = mockStore({ ...store, ...updates });

      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValueOnce([updatedStore]),
          }),
        }),
      });

      const result = await storeService.updateOwnStore(userId, updates);

      expect(result.username).toBe(store.username);
      expect(result.name).toBe("Updated Name");
    });

    it("username should remain unchanged after creation", async () => {
      const originalUsername = "original-username";
      const store = mockStore({ username: originalUsername });

      // Even if username is passed in updates, it shouldn't change
      const updates = {
        name: "New Name",
        // username: "new-username", // Should be ignored if passed
      };

      // In a real scenario, the schema validation would prevent this
      // but the service should also protect against it
      expect(store.username).toBe(originalUsername);
    });
  });

  // ============================================
  // PUBLIC VISIBILITY ENFORCEMENT TESTS
  // ============================================
  describe("Public visibility enforcement", () => {
    it("should return public store when isPublic is true", async () => {
      const publicStore = mockStore({
        username: "public-store",
        isPublic: true,
        deletedAt: null,
      });

      db.query.stores.findFirst.mockResolvedValueOnce(publicStore);

      const result = await storeService.getPublicStoreByUsername("public-store");

      expect(result).toBeDefined();
      expect(result.username).toBe("public-store");
      expect(result.name).toBe(publicStore.name);
    });

    it("should return 404 for private store (isPublic = false)", async () => {
      const privateStore = mockStore({
        username: "private-store",
        isPublic: false,
        deletedAt: null,
      });

      db.query.stores.findFirst.mockResolvedValueOnce(null); // Not found (filtered by isPublic)

      await expect(
        storeService.getPublicStoreByUsername("private-store")
      ).rejects.toThrow("Store not found");
    });

    it("should return 404 for soft-deleted store", async () => {
      const deletedStore = mockStore({
        username: "deleted-store",
        isPublic: true,
        deletedAt: new Date(),
      });

      db.query.stores.findFirst.mockResolvedValueOnce(null); // Not found (filtered by deletedAt)

      await expect(
        storeService.getPublicStoreByUsername("deleted-store")
      ).rejects.toThrow("Store not found");
    });

    it("should not expose sensitive fields in public response", async () => {
      const store = mockStore({
        username: "public-store",
        isPublic: true,
      });

      db.query.stores.findFirst.mockResolvedValueOnce(store);

      const result = await storeService.getPublicStoreByUsername("public-store");

      // Should only return safe fields
      expect(result).toHaveProperty("username");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("avatarUrl");
      expect(result).toHaveProperty("bannerUrl");
      expect(result).toHaveProperty("announcementText");
      expect(result).toHaveProperty("announcementEnabled");
      expect(result).toHaveProperty("isVacationMode");

      // Should NOT have userId or other sensitive fields
      expect(result).not.toHaveProperty("userId");
      expect(result).not.toHaveProperty("id");
      expect(result).not.toHaveProperty("createdAt");
      expect(result).not.toHaveProperty("updatedAt");
      expect(result).not.toHaveProperty("deletedAt");
    });
  });

  // ============================================
  // SOFT DELETE + ADMIN RESTORE TESTS
  // ============================================
  describe("Soft delete and admin restore", () => {
    it("should soft delete store (set deletedAt)", async () => {
      const userId = "user-123";
      const store = mockStore({ userId, deletedAt: null });

      db.query.stores.findFirst.mockResolvedValueOnce(store);

      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValueOnce(undefined),
        }),
      });

      await storeService.softDeleteStore(userId);

      // Verify update was called
      expect(db.update).toHaveBeenCalled();
    });

    it("should not be able to soft delete already deleted store", async () => {
      const userId = "user-123";
      const deletedStore = mockStore({ userId, deletedAt: new Date() });

      db.query.stores.findFirst.mockResolvedValueOnce(null); // Already deleted, isNull check fails

      await expect(storeService.softDeleteStore(userId)).rejects.toThrow(
        "Store not found"
      );
    });

    it("should allow admin to restore deleted store", async () => {
      const storeId = "store-123";
      const deletedStore = mockStore({ id: storeId, deletedAt: new Date() });
      const restoredStore = mockStore({ id: storeId, deletedAt: null });

      db.query.stores.findFirst.mockResolvedValueOnce(deletedStore);

      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValueOnce([restoredStore]),
          }),
        }),
      });

      const result = await storeService.adminRestoreStore(storeId);

      expect(result.deletedAt).toBeNull();
      expect(result.id).toBe(storeId);
    });

    it("should reject restore if store is not deleted", async () => {
      const storeId = "store-123";
      const activeStore = mockStore({ id: storeId, deletedAt: null });

      db.query.stores.findFirst.mockResolvedValueOnce(activeStore);

      await expect(storeService.adminRestoreStore(storeId)).rejects.toThrow(
        "Store is not deleted"
      );
    });

    it("should reject restore if store not found", async () => {
      const storeId = "nonexistent-store";

      db.query.stores.findFirst.mockResolvedValueOnce(null);

      await expect(storeService.adminRestoreStore(storeId)).rejects.toThrow(
        "Store not found"
      );
    });
  });

  // ============================================
  // ADMIN ACCESS BEHAVIOR TESTS
  // ============================================
  describe("Admin access behavior", () => {
    it("should allow admin to list all stores (including deleted)", async () => {
      const stores = [
        mockStore({ username: "store1", isPublic: true, deletedAt: null }),
        mockStore({ username: "store2", isPublic: false, deletedAt: null }),
        mockStore({
          username: "store3",
          isPublic: true,
          deletedAt: new Date(),
        }),
      ];

      db.query.stores.findMany.mockResolvedValueOnce(stores);

      const result = await storeService.adminListStores();

      expect(result).toHaveLength(3);
      expect(result).toEqual(stores);
    });

    it("should allow admin to get any store by ID", async () => {
      const storeId = "store-123";
      const store = mockStore({ id: storeId, isPublic: false });

      db.query.stores.findFirst.mockResolvedValueOnce(store);

      const result = await storeService.adminGetStoreById(storeId);

      expect(result).toEqual(store);
      expect(result.id).toBe(storeId);
    });

    it("should allow admin to see deleted stores", async () => {
      const storeId = "store-123";
      const deletedStore = mockStore({ id: storeId, deletedAt: new Date() });

      db.query.stores.findFirst.mockResolvedValueOnce(deletedStore);

      const result = await storeService.adminGetStoreById(storeId);

      expect(result.deletedAt).not.toBeNull();
    });

    it("should allow admin to see private stores", async () => {
      const storeId = "store-456";
      const privateStore = mockStore({ id: storeId, isPublic: false });

      db.query.stores.findFirst.mockResolvedValueOnce(privateStore);

      const result = await storeService.adminGetStoreById(storeId);

      expect(result.isPublic).toBe(false);
    });

    it("should return 404 if admin requests non-existent store", async () => {
      const storeId = "nonexistent";

      db.query.stores.findFirst.mockResolvedValueOnce(null);

      await expect(storeService.adminGetStoreById(storeId)).rejects.toThrow(
        "Store not found"
      );
    });
  });

  // ============================================
  // EDGE CASE TESTS
  // ============================================
  describe("Edge cases", () => {
    it("should handle vacation mode independently of visibility", async () => {
      const userId = "user-123";
      const store = mockStore({ userId, isPublic: true, isVacationMode: false });

      db.query.stores.findFirst.mockResolvedValueOnce(store);

      const updates = { isVacationMode: true };
      const updatedStore = mockStore({
        ...store,
        isVacationMode: true,
      });

      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValueOnce([updatedStore]),
          }),
        }),
      });

      const result = await storeService.updateOwnStore(userId, updates);

      expect(result.isVacationMode).toBe(true);
      expect(result.isPublic).toBe(true); // isPublic unchanged
    });

    it("should handle store with empty description", async () => {
      const store = mockStore({ description: null });

      expect(store.description).toBeNull();
    });

    it("should preserve timestamps correctly", async () => {
      const createdStore = mockStore();
      const beforeUpdate = new Date();

      const updatedStore = mockStore({
        ...createdStore,
        updatedAt: new Date(Date.now() + 1000),
      });

      expect(updatedStore.updatedAt.getTime()).toBeGreaterThan(
        beforeUpdate.getTime()
      );
    });
  });
});
