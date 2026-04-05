# Task 10: Identity Separation Refactoring - Implementation Guide

## Overview
This refactoring separates authentication (BetterAuth) from business logic by introducing explicit `merchants` and `customers` domains, removing role-based access control from the database.

## Changes Summary

### 1. Database Schema Changes

#### New Tables
- **merchants** - Store owners (1:1 with user via user_id)
  - `id` (uuid): Primary key
  - `user_id` (varchar): FK to user.id (UNIQUE)
  - `created_at`, `updated_at`

- **customers** - Buyers (may or may not be logged in)
  - `id` (uuid): Primary key
  - `user_id` (varchar, nullable): FK to user.id (for logged-in customers)
  - `email`, `phone` (UNIQUE combined): Guest customer matching
  - `name`, `created_at`, `updated_at`

#### Modified Tables
- **user**: Removed `role` column (CREATOR/BUYER/ADMIN)
- **stores**: Renamed `user_id` → `merchant_id` (uuid FK)
- **orders**: 
  - Removed: `buyer_id`, `buyer_email`, `buyer_phone`, `buyer_name`
  - Added: `customer_id` (uuid FK)
- **payouts**: Renamed `creator_id` → `merchant_id` (varchar→uuid via migration)
- **conversations**: 
  - Renamed: `creator_id` → `merchant_id`
  - Removed: `buyer_id`, `buyer_email`
  - Added: `customer_id` (uuid FK)
- **messages**: Updated `sender_role` enum (CREATOR/BUYER → MERCHANT/CUSTOMER)

#### Migration Files
1. **0007_merchants_customers_separation.sql** - Create merchants & customers tables
2. **0008_stores_user_to_merchant.sql** - Stores: userId → merchantId
3. **0009_orders_buyer_to_customer.sql** - Orders: buyerId → customerId
4. **0010_payouts_creator_to_merchant.sql** - Payouts: creatorId → merchantId
5. **0011_messaging_refactor.sql** - Conversations/Messages refactor
6. **0012_remove_role_column.sql** - Final cleanup (commented, run after validation)

### 2. Authentication & Authorization Changes

#### Auth Schema (auth.schema.ts)
- Removed: `userRole` enum
- Added: `merchants` and `customers` table definitions with relations

#### Auth Middleware (auth.middleware.ts)
- **requireAuth**: Checks session validity, attaches `req.user` (id, email only)
- **requireMerchant**: Checks if user has merchant record
- **requireAdmin**: Checks if user ID in ENV `ADMIN_USER_IDS`
- Removed: `requireRole` function (deleted)

#### Type Updates
- **express.d.ts**: User interface no longer includes `role`
- **roles.ts**: Comments only (roles removed)

### 3. Module-Specific Changes

#### Auth Module
- ✅ Schema updated with merchants/customers
- ✅ Middleware refactored
- ✅ Service: Added merchant/customer lookup methods
- TODO: Update core auth hooks if using role syncing

#### Stores Module
- ✅ Changed userId → merchantId in schema
- ✅ Service: Auto-create merchant on first store creation
- ✅ Routes: Using requireMerchant & requireAdmin
- TODO: Update data migration script

#### Orders Module
- ✅ Schema: buyerId → customerId
- ✅ Service: Find/create customers by (email, phone)
- ✅ Routes: Updated middleware (removed buyer role)
- ✅ Removed: buyers table (using customers instead)

#### Products Module
- ✅ Service: getStoreByUser now finds merchant first
- TODO: Validate product ownership tests

#### Payouts Module
- ✅ Schema: creatorId → merchantId
- ✅ Routes: Using requireMerchant & requireAdmin
- TODO: Update payout service and controller

#### Messaging Module
- ✅ Schema: Roles updated (CREATOR/BUYER → MERCHANT/CUSTOMER)
- ✅ Schema: creatorId → merchantId, buyerId → customerId
- ✅ Routes: Updated middleware
- TODO: Update message service and controller

#### Downloads Module
- ✅ Routes: Updated middleware (removed role checks)
- TODO: Verify download service logic still works

#### Admin Module
- ✅ Audit service: Works with merchantId for merchants
- TODO: Update admin controller methods
- TODO: Test audit logging

### 4. Remaining TODO Items

#### Critical
- [ ] Data migration script implementation (migrate existing data)
- [ ] Update all service methods that query stores by userId
- [ ] Update payout service methods
- [ ] Update message service methods
- [ ] Update product service validations

#### Important
- [ ] Update test files for new models
- [ ] Test merchant creation flow
- [ ] Test customer deduplication
- [ ] Test guest checkout with customers table
- [ ] Test logged-in customer with userId

#### Nice to Have
- [ ] Audit logging tests
- [ ] Permission validation tests
- [ ] Migration rollback strategy
- [ ] Data validation after migration

### 5. Migration Execution Steps

1. **Pre-migration Validation**
   ```bash
   ts-node scripts/validate-migration.ts
   ```

2. **Apply Database Migrations** (in order)
   ```bash
   npm run db:migrate
   ```

3. **Run Data Migration**
   ```bash
   ts-node scripts/migrate-to-merchants-customers.ts
   ```

4. **Verify Data Integrity**
   - Check merchants table populated correctly
   - Check customers table for orders
   - Check stores.merchantId mappings
   - Check payouts merchant references

5. **Deploy Application Code**
   - Ensure all imports updated (no requireRole)
   - Test authentication flow
   - Test store creation (creates merchant)
   - Test order creation (finds/creates customer)

6. **Final Cleanup** (only after verification)
   ```sql
   -- Uncomment in 0012_remove_role_column.sql and apply
   ALTER TABLE "user" DROP COLUMN role;
   DROP TYPE user_role;
   ```

### 6. Key Design Decisions

#### Why separate merchants & customers?
- BetterAuth is identity-only (no business logic)
- Merchants = store owners (tied to user)
- Customers = buyers (may be guest or logged-in)
- Decouples auth from business domains

#### Why (email, phone) for customer matching?
- Guests don't have user accounts
- Email + phone is unique constraint
- Deduplicates customer records across orders
- Allows customer reuse safely

#### Why UUID for merchant_id in stores?
- Consistent with other UUIDs
- Easier indexing and relationships
- Migration path: user_id (varchar) → merchant_id (uuid)

### 7. Environment Configuration

Required ENV variables:
```env
ADMIN_USER_IDS=user-id-1,user-id-2,user-id-3
```

This replaces the role-based admin checks in database.

### 8. Testing Strategy

```typescript
// Test merchant creation
test('creating store auto-creates merchant', async () => {
  const userId = 'test-user-123';
  const store = await createStore(userId, { ... });
  const merchant = await getMerchant(userId);
  expect(merchant).toBeDefined();
});

// Test customer deduplication
test('duplicate email+phone creates one customer', async () => {
  const order1 = await createOrder({ buyerEmail: 'test@ex.com', buyerPhone: '123' });
  const order2 = await createOrder({ buyerEmail: 'test@ex.com', buyerPhone: '123' });
  const customers = await db.query.customers.findMany();
  expect(customers).toHaveLength(1);
});

// Test logged-in customer
test('logged-in customer has user_id', async () => {
  const customer = await createCustomer('test@ex.com', '123', userId: 'user-123');
  expect(customer.userId).toBe('user-123');
});
```

### 9. Known Limitations & Future Work

- Admin check uses ENV list (not database), consider admin table in future
- Merchant = user (1:1), future could support multi-store merchants
- Customer deduplication only on (email, phone), consider phone validation
- No audit trail for customer creation, could add in future

### 10. Rollback Plan

If issues found:
1. Don't remove role column yet (0012 commented out)
2. Keep role data in user table
3. Disable merchant/customer routes (404)
4. Revert to using requireRole middleware
5. Deploy previous version

Full rollback is possible as long as role column remains and merchants/customers tables aren't relied upon.
