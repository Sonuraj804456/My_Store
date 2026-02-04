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
