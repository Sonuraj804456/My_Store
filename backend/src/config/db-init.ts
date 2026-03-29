import { spawn } from "node:child_process";
import { env } from "./env";
import { Pool } from "pg";
import path from "node:path";

const RETRY_DELAY_MS = 1000;
const READY_TIMEOUT_MS = 120_000;
const rootDir = path.resolve(__dirname, "../..");

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForDatabaseReady(): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;

  while (Date.now() <= deadline) {
    const client = new Pool({ connectionString: env.DATABASE_URL });

    try {
      await client.query("SELECT 1");
      await client.end();
      return;
    } catch {
      await client.end();
      await delay(RETRY_DELAY_MS);
    }
  }

  throw new Error("Database did not become ready in time");
}

export async function runMigrations(): Promise<void> {
  console.log("➡️  Applying database migrations...");

  await new Promise<void>((resolve, reject) => {
    const migrate = spawn("pnpm", ["run", "db:migrate"], {
      stdio: "inherit",
      cwd: rootDir,
    });

    migrate.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Migration process exited with code ${code}`));
      }
    });

    migrate.on("error", (error) => reject(error));
  });
}

export async function initializeDatabase(): Promise<void> {
  await waitForDatabaseReady();
  await runMigrations();
}
