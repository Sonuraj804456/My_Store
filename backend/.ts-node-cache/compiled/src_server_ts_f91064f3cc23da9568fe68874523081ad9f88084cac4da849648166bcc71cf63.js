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
        console.log("Admin user already exists:", email);
        console.log("Note: Admin access is controlled via ADMIN_USER_IDS environment variable");
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
            console.log("Admin user created:", email);
            console.log("Note: Add this user's ID to ADMIN_USER_IDS environment variable to grant admin access");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvc2VydmVyLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOERBQTBEO0FBQzFELHdEQUFnRDtBQUNoRCwwREFBMkQ7QUFDM0QsOENBQXNEO0FBRXRELEtBQUssVUFBVSxTQUFTO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0lBRTVDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRO1FBQUUsT0FBTztJQUVoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFFcEIsSUFBSSxDQUFDO1FBQ0gsUUFBUSxHQUFHLE1BQU0sMEJBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDbEIsK0NBQStDO1FBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUNsRCxPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksUUFBUSxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEVBQTBFLENBQUMsQ0FBQztRQUN4RixPQUFPO0lBQ1QsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQ3hDLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLO2dCQUNMLFFBQVE7YUFDVDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxFQUFFLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUZBQXVGLENBQUMsQ0FBQztRQUN2RyxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7QUFDSCxDQUFDO0FBR0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBRXRDLEtBQUssVUFBVSxRQUFRO0lBQ3JCLElBQUksQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxNQUFNLElBQUEsNEJBQWtCLEdBQUUsQ0FBQztRQUUzQixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEQsTUFBTSxTQUFTLEVBQUUsQ0FBQztRQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFBLDJCQUFjLEdBQUUsQ0FBQztRQUV2QixhQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7QUFDSCxDQUFDO0FBRUQsUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gXCIuL2FwcFwiO1xuaW1wb3J0IHsgdXNlclNlcnZpY2UgfSBmcm9tIFwiLi9tb2R1bGVzL2F1dGgvYXV0aC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vbW9kdWxlcy9hdXRoL2F1dGguY29yZVwiO1xuaW1wb3J0IHsgc3RhcnRKb2JSdW5uZXIgfSBmcm9tIFwiLi9tb2R1bGVzL2pvYnMvam9iLXJ1bm5lclwiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZURhdGFiYXNlIH0gZnJvbSBcIi4vY29uZmlnL2RiLWluaXRcIjtcblxuYXN5bmMgZnVuY3Rpb24gc2VlZEFkbWluKCkge1xuICBjb25zdCBlbWFpbCA9IHByb2Nlc3MuZW52LkFETUlOX0VNQUlMO1xuICBjb25zdCBwYXNzd29yZCA9IHByb2Nlc3MuZW52LkFETUlOX1BBU1NXT1JEO1xuXG4gIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSByZXR1cm47XG5cbiAgbGV0IGV4aXN0aW5nID0gbnVsbDtcblxuICB0cnkge1xuICAgIGV4aXN0aW5nID0gYXdhaXQgdXNlclNlcnZpY2UuZ2V0QnlFbWFpbChlbWFpbCk7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgLy8gdGFibGUgZG9lc24ndCBleGlzdCB5ZXQg4oaSIG1pZ3JhdGlvbnMgbm90IHJ1blxuICAgIGNvbnNvbGUud2FybihcIlNraXBwaW5nIGFkbWluIHNlZWQ6IERCIG5vdCByZWFkeVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZXhpc3RpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhcIkFkbWluIHVzZXIgYWxyZWFkeSBleGlzdHM6XCIsIGVtYWlsKTtcbiAgICBjb25zb2xlLmxvZyhcIk5vdGU6IEFkbWluIGFjY2VzcyBpcyBjb250cm9sbGVkIHZpYSBBRE1JTl9VU0VSX0lEUyBlbnZpcm9ubWVudCB2YXJpYWJsZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGF1dGguYXBpLnNpZ25VcEVtYWlsKHtcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgbmFtZTogXCJBZG1pblwiLFxuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2coXCJBZG1pbiB1c2VyIGNyZWF0ZWQ6XCIsIGVtYWlsKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTm90ZTogQWRkIHRoaXMgdXNlcidzIElEIHRvIEFETUlOX1VTRVJfSURTIGVudmlyb25tZW50IHZhcmlhYmxlIHRvIGdyYW50IGFkbWluIGFjY2Vzc1wiKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIGFkbWluIHVzZXI6XCIsIGVycm9yKTtcbiAgfVxufVxuXG5cbmNvbnN0IFBPUlQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDQwMDA7XG5cbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0QXBwKCkge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKFwi8J+UpyBJbml0aWFsaXppbmcgZGF0YWJhc2UgYW5kIHNjaGVtYS4uLlwiKTtcbiAgICBhd2FpdCBpbml0aWFsaXplRGF0YWJhc2UoKTtcblxuICAgIGNvbnNvbGUubG9nKFwi8J+RpCBTZWVkaW5nIGFkbWluIHVzZXIgaWYgY29uZmlndXJlZC4uLlwiKTtcbiAgICBhd2FpdCBzZWVkQWRtaW4oKTtcblxuICAgIGNvbnNvbGUubG9nKFwi8J+OryBTdGFydGluZyBqb2IgcnVubmVyLi4uXCIpO1xuICAgIGF3YWl0IHN0YXJ0Sm9iUnVubmVyKCk7XG5cbiAgICBhcHAubGlzdGVuKFBPUlQsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBTZXJ2ZXIgcnVubmluZyBvbiBwb3J0ICR7UE9SVH1gKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHN0YXJ0IGJhY2tlbmQ6XCIsIGVycm9yKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cbn1cblxuc3RhcnRBcHAoKTtcbiJdfQ==