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
