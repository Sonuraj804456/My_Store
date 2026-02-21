▶️ How to Run the Project
Prerequisites:
Docker
Docker Compose

Start all services (frontend, backend, database):
docker compose up --build

This single command starts the entire application.

🗄️ How to Migrate Database (Drizzle)

After containers are running, run migrations inside the backend container:
docker compose exec backend pnpm run db:migrate

This will create all required tables in PostgreSQL using Drizzle.

Note: `db:migrate` runs the Drizzle migration push (drizzle-kit). You can also run the underlying command directly:

```
cd backend
pnpm exec drizzle-kit push
```
This applies any new migrations (including DB-level constraints).

Run all backend tests:
docker compose exec backend pnpm test

📌 Common Commands
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (reset DB)
docker compose down -v

# Check running containers
docker compose ps

# View logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Access PostgreSQL
docker compose exec db psql -U postgres -d appdb


🏪 Store Module – Behavior & Rules

This document describes the lifecycle, visibility rules, and admin capabilities for stores in the system.

📦 Store Lifecycle
A store goes through the following states:

Created
-Created by a user with the CREATOR role
-Each creator can own only one store
-Store is active immediately after creation

Updated
Store metadata (name, description, visibility, etc.) can be updated by the owner
Username cannot be updated after creation

Notes on validation and DB rules:

- `name`: When provided during updates, `name` must be a non-empty string (min 1, max 80). The database also enforces a CHECK constraint preventing empty `name` values.
- Unique collisions (for example duplicate `username` or duplicate `user_id`) are handled consistently: the service maps DB unique-constraint violations to `409 Conflict` responses (`ApiError(409, ...)`) so collisions do not appear as generic 500 errors.

Soft Deleted
Store is soft-deleted by the owner or an admin
Soft-deleted stores are not visible to the public
Data is preserved in the database

Restored (Admin only)
Admin can restore a soft-deleted store
Restored store becomes active again

👁️ Visibility Rules:

Stores follow strict visibility rules:
Public Store (isPublic = true)

Accessible via:
GET /v1/api/stores/:username

Visible to all users (no auth required)

Private Store (isPublic = false)
Not accessible publicly

Only visible to:
Store owner

Admin users

Soft Deleted Store
Never visible publicly
Only accessible to admins for restore operations

🔒 Username Permanence:

The store username:
Is unique

Is validated (lowercase, numbers, hyphens)
Cannot be changed after creation

This ensures:
-Stable URLs
-SEO safety
-External link reliability

🏖️ Vacation Mode:
Stores support vacation mode:
When isVacationMode = true:
Store remains visible
Purchases / actions can be restricted (business logic dependent)
Public store page may display a vacation notice
Vacation mode does not:
Delete the store
Change visibility (isPublic remains unchanged)

🛠️ Admin Capabilities:
Admins have elevated control:
View all stores (including private & deleted)
Get store by ID
Restore soft-deleted stores
Inspect ownership and status
Admin endpoints are protected by:
requireAuth
requireRole(ADMIN)

Implementation notes:
- `requireAuth` middleware accepts bearer tokens and will also attempt to resolve a BetterAuth session (cookie-based) when no `Authorization` header is present. This allows cookie/session flows alongside token auth.

PRODUCT MODULE:

1️⃣ Product Lifecycle

Products follow a strict lifecycle:draft → published → soft_deleted
Draft:
-Default state when product is created
-Not visible in public APIs
-Fully editable
Published:
-Visible publicly
-Must satisfy all publishing validation rules
-Cannot violate variant or media constraints

Soft Deleted:
-deleted_at timestamp is set
-Excluded from all listings (admin & public)
-Not physically removed from the database

2️⃣ Publishing Rules

A product cannot be published unless all of the following conditions are met:

✅ At least one variant exists

✅ At least one media item exists

✅ No variant has negative inventory

If validation fails, an error is thrown:

ApiError(400, "At least one variant required")

ApiError(400, "At least one media required")

Publishing validation is enforced inside the updateProduct() service method.

3️⃣ Variant Logic

Each product:

Must have at least 1 variant before publishing

Can have multiple variants

Variants belong to a specific product

Variant Fields

name

price

inventory

Rules

Price is stored as decimal

Inventory cannot be negative

Variants are store-scoped

Variants are excluded if product is soft deleted

4️⃣ Category Logic

Categories are:

Scoped per store

Unique per store

Constraint

Two categories with the same name cannot exist in the same store.

If violated:

ApiError(409, "Category already exists in this store")
5️⃣ Media Constraints

Each product:

Must have at least 1 media item before publishing

Can have a maximum of 10 media items

Media Fields

url

type (required, NOT NULL)

position (used for ordering)

Rules

type is mandatory

Publishing fails if no media exists

Media count is capped at 10

6️⃣ Public Filtering Behavior

Public APIs:

Return only products with status = "published"

Exclude soft deleted products

Filter by store username

Never return draft products

Visibility Matrix
Product State	Publicly Visible
draft	❌ No
published	✅ Yes
soft_deleted	❌ No
7️⃣ Testing Coverage (Mandatory)

Unit tests implemented for:

✅ Product creation

✅ Variant creation

✅ Publishing validation rules

✅ Category uniqueness per store

✅ Public visibility filtering

✅ Soft delete behavior

Run tests using:

docker compose exec backend pnpm test

All mandatory product module tests pass successfully.
