"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForDatabaseReady = waitForDatabaseReady;
exports.runMigrations = runMigrations;
exports.initializeDatabase = initializeDatabase;
const node_child_process_1 = require("node:child_process");
const env_1 = require("./env");
const pg_1 = require("pg");
const node_path_1 = __importDefault(require("node:path"));
const RETRY_DELAY_MS = 1000;
const READY_TIMEOUT_MS = 120000;
const rootDir = node_path_1.default.resolve(__dirname, "../..");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForDatabaseReady() {
    const deadline = Date.now() + READY_TIMEOUT_MS;
    while (Date.now() <= deadline) {
        const client = new pg_1.Pool({ connectionString: env_1.env.DATABASE_URL });
        try {
            await client.query("SELECT 1");
            await client.end();
            return;
        }
        catch {
            await client.end();
            await delay(RETRY_DELAY_MS);
        }
    }
    throw new Error("Database did not become ready in time");
}
async function runMigrations() {
    console.log("➡️  Applying database migrations...");
    await new Promise((resolve, reject) => {
        const migrate = (0, node_child_process_1.spawn)("pnpm", ["run", "db:migrate"], {
            stdio: "inherit",
            cwd: rootDir,
        });
        migrate.on("exit", (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Migration process exited with code ${code}`));
            }
        });
        migrate.on("error", (error) => reject(error));
    });
}
async function initializeDatabase() {
    await waitForDatabaseReady();
    await runMigrations();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvY29uZmlnL2RiLWluaXQudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL2NvbmZpZy9kYi1pbml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBV0Esb0RBaUJDO0FBRUQsc0NBbUJDO0FBRUQsZ0RBR0M7QUF0REQsMkRBQTJDO0FBQzNDLCtCQUE0QjtBQUM1QiwyQkFBMEI7QUFDMUIsMERBQTZCO0FBRTdCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQUM1QixNQUFNLGdCQUFnQixHQUFHLE1BQU8sQ0FBQztBQUNqQyxNQUFNLE9BQU8sR0FBRyxtQkFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFakQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFekUsS0FBSyxVQUFVLG9CQUFvQjtJQUN4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7SUFFL0MsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksUUFBUSxFQUFFLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFJLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxTQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUM7WUFDSCxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0IsTUFBTSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbkIsT0FBTztRQUNULENBQUM7UUFBQyxNQUFNLENBQUM7WUFDUCxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNuQixNQUFNLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRU0sS0FBSyxVQUFVLGFBQWE7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBRW5ELE1BQU0sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDMUMsTUFBTSxPQUFPLEdBQUcsSUFBQSwwQkFBSyxFQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsRUFBRTtZQUNuRCxLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLEVBQUUsT0FBTztTQUNiLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHNDQUFzQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEUsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLEtBQUssVUFBVSxrQkFBa0I7SUFDdEMsTUFBTSxvQkFBb0IsRUFBRSxDQUFDO0lBQzdCLE1BQU0sYUFBYSxFQUFFLENBQUM7QUFDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgZW52IH0gZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5cbmNvbnN0IFJFVFJZX0RFTEFZX01TID0gMTAwMDtcbmNvbnN0IFJFQURZX1RJTUVPVVRfTVMgPSAxMjBfMDAwO1xuY29uc3Qgcm9vdERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi5cIik7XG5cbmNvbnN0IGRlbGF5ID0gKG1zOiBudW1iZXIpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yRGF0YWJhc2VSZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZGVhZGxpbmUgPSBEYXRlLm5vdygpICsgUkVBRFlfVElNRU9VVF9NUztcblxuICB3aGlsZSAoRGF0ZS5ub3coKSA8PSBkZWFkbGluZSkge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBQb29sKHsgY29ubmVjdGlvblN0cmluZzogZW52LkRBVEFCQVNFX1VSTCB9KTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjbGllbnQucXVlcnkoXCJTRUxFQ1QgMVwiKTtcbiAgICAgIGF3YWl0IGNsaWVudC5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGF3YWl0IGNsaWVudC5lbmQoKTtcbiAgICAgIGF3YWl0IGRlbGF5KFJFVFJZX0RFTEFZX01TKTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBkaWQgbm90IGJlY29tZSByZWFkeSBpbiB0aW1lXCIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuTWlncmF0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc29sZS5sb2coXCLinqHvuI8gIEFwcGx5aW5nIGRhdGFiYXNlIG1pZ3JhdGlvbnMuLi5cIik7XG5cbiAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IG1pZ3JhdGUgPSBzcGF3bihcInBucG1cIiwgW1wicnVuXCIsIFwiZGI6bWlncmF0ZVwiXSwge1xuICAgICAgc3RkaW86IFwiaW5oZXJpdFwiLFxuICAgICAgY3dkOiByb290RGlyLFxuICAgIH0pO1xuXG4gICAgbWlncmF0ZS5vbihcImV4aXRcIiwgKGNvZGUpID0+IHtcbiAgICAgIGlmIChjb2RlID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYE1pZ3JhdGlvbiBwcm9jZXNzIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWApKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1pZ3JhdGUub24oXCJlcnJvclwiLCAoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRpYWxpemVEYXRhYmFzZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXdhaXQgd2FpdEZvckRhdGFiYXNlUmVhZHkoKTtcbiAgYXdhaXQgcnVuTWlncmF0aW9ucygpO1xufVxuIl19