const path = require("node:path");
const fs = require("node:fs");
const dotenv = require("dotenv");
const { Client } = require("pg");

const rootEnv = path.resolve(__dirname, "../../.env");
const testEnv = path.resolve(__dirname, "../../.env.test");

if (process.env.NODE_ENV === "test") {
  if (fs.existsSync(testEnv)) {
    dotenv.config({ path: testEnv });
  } else if (fs.existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
  }
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@db:5432/my_store_test";

const targetUrl = new URL(connectionString);
const targetDatabase = (targetUrl.pathname || "").slice(1) || "my_store_test";

const adminUrl = new URL(connectionString);
adminUrl.pathname = "/postgres";

async function ensureDatabase() {
  const client = new Client({ connectionString: adminUrl.toString() });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${targetDatabase}"`);
    console.log(`Created test database '${targetDatabase}'.`);
  } catch (error) {
    if (error.code === "42P04") {
      console.log(`Database '${targetDatabase}' already exists.`);
    } else {
      console.error("Error creating database:", error);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

ensureDatabase();
