📥 Install Dependencies
Run:pnpm install

🗄️ Database Migrations
This project uses Drizzle push migrations.
Run migrations:pnpm drizzle-kit push
This will:
Pull database schema
Compare changes
Apply safe updates

🚀 Run the Server
Development mode:pnpm dev
Server will start at:http://localhost:3000


🔐 Authentication (High-Level)

Authentication uses a two-layer strategy:

1. BetterAuth Browser Sessions
-Stored via cookies
-Managed internally by BetterAuth
-Used for web auth flows

2. Bearer Token Fallback
-Sent via HTTP header:
-Authorization: Bearer <session_token>

Used for:
-Tools (Postman)
-Mobile apps
-Non-browser clients

👮‍♂️ Auth Middleware
Middleware checks auth in this order:
-BetterAuth session (auth.api.getSession)
-Bearer token stored in DB
-Respond 401 Unauthorized if neither exists

🧩 Role Handling

Roles are stored directly in the user table using a PostgreSQL enum:
enum: ['ADMIN', 'CREATOR', 'BUYER']

Reasons for this approach:
✔ Simpler
✔ No join tables
✔ Fast lookup for RBAC

Default role = CREATOR.

🧩 Assumptions
-Migration approach: Drizzle push migrations
-Role storage: Stored in user.role
-BetterAuth manages session security
-Bearer tokens allowed for testing
-No MFA or OAuth required
-No E2E tests required