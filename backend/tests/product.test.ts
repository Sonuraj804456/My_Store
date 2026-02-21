import { describe, it, expect, beforeEach, afterEach } from "vitest";
import crypto from "crypto";

import { db } from "../src/config/db";

import * as productService from "../src/modules/products/product.service";

import { stores } from "../src/modules/stores/store.db";
import { products } from "../src/modules/products/product.db";
import { categories } from "../src/modules/products/product.db";
import { productVariants } from "../src/modules/products/product.db";
import { user } from "../src/modules/auth/auth.schema";
let storeId: string;
let storeUsername: string;

describe("Product Module - Mandatory Tests", () => {

  beforeEach(async () => {
    /* ---------------------------------------------------
       Create VALID user (ONLY existing columns)
    --------------------------------------------------- */

    const insertedUser = await db.insert(user).values({
      id: crypto.randomUUID(),
      name: "Test User",         // ✔️ use real columns only
      email: `test-${Date.now()}@mail.com`,
      role: "CREATOR",
    }).returning();

    /* ---------------------------------------------------
       Create VALID store (match your schema)
    --------------------------------------------------- */

    const insertedStore = await db.insert(stores).values({
      id: crypto.randomUUID(),
      name: "Test Store",
      username: `store-${Date.now()}`,
      userId: insertedUser[0].id,
    }).returning();

    storeId = insertedStore[0].id;
    storeUsername = insertedStore[0].username;
  });

  afterEach(async () => {
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(stores);
    await db.delete(user);
  });

  /* =====================================================
     1️⃣ Product Creation
  ====================================================== */

  it("should create a product in draft state", async () => {
    const product = await productService.createProduct(storeId, {
      title: "Test Product",
      description: "Test Desc",
    });

    expect(product.status).toBe("draft");
  });

  /* =====================================================
     2️⃣ Variant Creation
  ====================================================== */

  it("should create a variant for product", async () => {
    const product = await productService.createProduct(storeId, {
      title: "Variant Product",
    });

    const variant = await productService.addVariant(
      storeId,
      product.id,
      {
        name: "Default",
        price: 100,
        stock: 10,
      }
    );

    expect(Number(variant.price)).toBe(100);
  });

  /* =====================================================
   3️⃣ Publishing Validation
====================================================== */

it("should NOT allow publishing without variant", async () => {
  const product = await productService.createProduct(storeId, {
    title: "No Variant Product",
  });

  await expect(
    productService.updateProduct(storeId, product.id, {
      status: "published",
    })
  ).rejects.toThrow("At least one variant required");
});


it("should return only published products publicly", async () => {
  const product = await productService.createProduct(storeId, {
    title: "Hidden Product",
  });

  // Add variant
  await productService.addVariant(storeId, product.id, {
    name: "Default",
    price: 100,
    inventory: 5,
  });

  // Add media (REQUIRED)
  await productService.addMedia(storeId, product.id, {
    url: "https://image.com/test.jpg",
    type: "image",
    position: 1,
  });

  // Publish
  await productService.updateProduct(storeId, product.id, {
    status: "published",
  });

  const publicProducts =
    await productService.listPublishedByStore(storeUsername);

  expect(publicProducts.length).toBe(1);
  expect(publicProducts[0].title).toBe("Hidden Product");
});
  /* =====================================================
     4️⃣ Category Uniqueness Per Store
  ====================================================== */

  it("should prevent duplicate category name in same store", async () => {
    await productService.createCategory(storeId, "Electronics");

    await expect(
      productService.createCategory(storeId, "Electronics")
    ).rejects.toThrow();
  });

  /* =====================================================
     5️⃣ Public Visibility Filtering
  ====================================================== */

  it("should return only published products publicly", async () => {
  // Create product
  const product = await productService.createProduct(storeId, {
    title: "Public Product",
  });

  // Add variant
  await productService.addVariant(storeId, product.id, {
    name: "Default",
    price: 100,
    inventory: 5,
  });

  // Add media (REQUIRED before publishing)
  await productService.addMedia(storeId, product.id, {
    url: "https://image.com/test.jpg",
    type: "image",
    position: 1,
  });

  // Publish
  await productService.updateProduct(storeId, product.id, {
    status: "published",
  });

  const publicProducts =
    await productService.listPublishedByStore(storeUsername);

  expect(publicProducts.length).toBe(1);
  expect(publicProducts[0].title).toBe("Public Product");
});
  /* =====================================================
     6️⃣ Soft Delete Behavior
  ====================================================== */

  it("should soft delete product and exclude from results", async () => {
    const product = await productService.createProduct(storeId, {
      title: "Delete Me",
    });

    await productService.softDeleteProduct(storeId, product.id);

    const ownProducts =
      await productService.getOwnProducts(storeId);

    expect(
      ownProducts.find((p) => p.id === product.id)
    ).toBeUndefined();
  });

});