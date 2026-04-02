"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const auth_service_1 = require("./modules/auth/auth.service");
const auth_core_1 = require("./modules/auth/auth.core");
const job_runner_1 = require("./modules/jobs/job-runner");
const db_init_1 = require("./config/db-init");
async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password)
        return;
    let existing = null;
    try {
        existing = await auth_service_1.userService.getByEmail(email);
    }
    catch (err) {
        // table doesn't exist yet → migrations not run
        console.warn("Skipping admin seed: DB not ready");
        return;
    }
    if (existing) {
        // Ensure existing user has ADMIN role
        if (existing.role !== "ADMIN") {
            await auth_service_1.userService.setRoleByEmail(email, "ADMIN");
            console.log("Admin role updated for existing user:", email);
        }
        return;
    }
    try {
        const result = await auth_core_1.auth.api.signUpEmail({
            body: {
                name: "Admin",
                email,
                password,
            },
        });
        if (result) {
            // After signup, set the role to ADMIN (default is CREATOR)
            await auth_service_1.userService.setRoleByEmail(email, "ADMIN");
            console.log("Admin user created:", email);
        }
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
}
const PORT = process.env.PORT || 4000;
async function startApp() {
    try {
        console.log("🔧 Initializing database and schema...");
        await (0, db_init_1.initializeDatabase)();
        console.log("👤 Seeding admin user if configured...");
        await seedAdmin();
        console.log("🎯 Starting job runner...");
        await (0, job_runner_1.startJobRunner)();
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start backend:", error);
        process.exit(1);
    }
}
startApp();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvc2VydmVyLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOERBQTBEO0FBQzFELHdEQUFnRDtBQUNoRCwwREFBMkQ7QUFDM0QsOENBQXNEO0FBRXRELEtBQUssVUFBVSxTQUFTO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0lBRTVDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRO1FBQUUsT0FBTztJQUVoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFFcEIsSUFBSSxDQUFDO1FBQ0gsUUFBUSxHQUFHLE1BQU0sMEJBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDbEIsK0NBQStDO1FBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNsRCxPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksUUFBUSxFQUFFLENBQUM7UUFDYixzQ0FBc0M7UUFDdEMsSUFBSyxRQUFnQixDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUN2QyxNQUFNLDBCQUFXLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQ3hDLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLO2dCQUNMLFFBQVE7YUFDVDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCwyREFBMkQ7WUFDM0QsTUFBTSwwQkFBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDSCxDQUFDO0FBR0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBRXRDLEtBQUssVUFBVSxRQUFRO0lBQ3JCLElBQUksQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxNQUFNLElBQUEsNEJBQWtCLEdBQUUsQ0FBQztRQUUzQixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEQsTUFBTSxTQUFTLEVBQUUsQ0FBQztRQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFBLDJCQUFjLEdBQUUsQ0FBQztRQUV2QixhQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDO0FBRUQsUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IHsgdXNlclNlcnZpY2UgfSBmcm9tIFwiLi9tb2R1bGVzL2F1dGgvYXV0aC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vbW9kdWxlcy9hdXRoL2F1dGguY29yZVwiO1xuaW1wb3J0IHsgc3RhcnRKb2JSdW5uZXIgfSBmcm9tIFwiLi9tb2R1bGVzL2pvYnMvam9iLXJ1bm5lclwiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZURhdGFiYXNlIH0gZnJvbSBcIi4vY29uZmlnL2RiLWluaXRcIjtcblxuYXN5bmMgZnVuY3Rpb24gc2VlZEFkbWluKCkge1xuICBjb25zdCBlbWFpbCA9IHByb2Nlc3MuZW52LkFETUlOX0VNQUlMO1xuICBjb25zdCBwYXNzd29yZCA9IHByb2Nlc3MuZW52LkFETUlOX1BBU1NXT1JEO1xuXG4gIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSByZXR1cm47XG5cbiAgbGV0IGV4aXN0aW5nID0gbnVsbDtcblxuICB0cnkge1xuICAgIGV4aXN0aW5nID0gYXdhaXQgdXNlclNlcnZpY2UuZ2V0QnlFbWFpbChlbWFpbCk7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgLy8gdGFibGUgZG9lc24ndCBleGlzdCB5ZXQg4oaSIG1pZ3JhdGlvbnMgbm90IHJ1blxuICAgIGNvbnNvbGUud2FybihcIlNraXBwaW5nIGFkbWluIHNlZWQ6IERCIG5vdCByZWFkeVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZXhpc3RpbmcpIHtcbiAgICAvLyBFbnN1cmUgZXhpc3RpbmcgdXNlciBoYXMgQURNSU4gcm9sZVxuICAgIGlmICgoZXhpc3RpbmcgYXMgYW55KS5yb2xlICE9PSBcIkFETUlOXCIpIHtcbiAgICAgIGF3YWl0IHVzZXJTZXJ2aWNlLnNldFJvbGVCeUVtYWlsKGVtYWlsLCBcIkFETUlOXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJBZG1pbiByb2xlIHVwZGF0ZWQgZm9yIGV4aXN0aW5nIHVzZXI6XCIsIGVtYWlsKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhdXRoLmFwaS5zaWduVXBFbWFpbCh7XG4gICAgICBib2R5OiB7XG4gICAgICAgIG5hbWU6IFwiQWRtaW5cIixcbiAgICAgICAgZW1haWwsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIC8vIEFmdGVyIHNpZ251cCwgc2V0IHRoZSByb2xlIHRvIEFETUlOIChkZWZhdWx0IGlzIENSRUFUT1IpXG4gICAgICBhd2FpdCB1c2VyU2VydmljZS5zZXRSb2xlQnlFbWFpbChlbWFpbCwgXCJBRE1JTlwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiQWRtaW4gdXNlciBjcmVhdGVkOlwiLCBlbWFpbCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjcmVhdGluZyBhZG1pbiB1c2VyOlwiLCBlcnJvcik7XG4gIH1cbn1cblxuXG5jb25zdCBQT1JUID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCA0MDAwO1xuXG5hc3luYyBmdW5jdGlvbiBzdGFydEFwcCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhcIvCflKcgSW5pdGlhbGl6aW5nIGRhdGFiYXNlIGFuZCBzY2hlbWEuLi5cIik7XG4gICAgYXdhaXQgaW5pdGlhbGl6ZURhdGFiYXNlKCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIvCfkaQgU2VlZGluZyBhZG1pbiB1c2VyIGlmIGNvbmZpZ3VyZWQuLi5cIik7XG4gICAgYXdhaXQgc2VlZEFkbWluKCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIvCfjq8gU3RhcnRpbmcgam9iIHJ1bm5lci4uLlwiKTtcbiAgICBhd2FpdCBzdGFydEpvYlJ1bm5lcigpO1xuXG4gICAgYXBwLmxpc3RlbihQT1JULCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgU2VydmVyIHJ1bm5pbmcgb24gcG9ydCAke1BPUlR9YCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzdGFydCBiYWNrZW5kOlwiLCBlcnJvcik7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG59XG5cbnN0YXJ0QXBwKCk7XG4iXX0=