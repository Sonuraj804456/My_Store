import app from "./app";
import { userService } from "./modules/auth/auth.service";
import { auth } from "./modules/auth/auth.core";
import { startJobRunner } from "./modules/jobs/job-runner";
import { initializeDatabase } from "./config/db-init";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  let existing = null;

  try {
    existing = await userService.getByEmail(email);
  } catch (err: any) {
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
    const result = await auth.api.signUpEmail({
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
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}


const PORT = process.env.PORT || 4000;

async function startApp() {
  try {
    console.log("🔧 Initializing database and schema...");
    await initializeDatabase();

    console.log("👤 Seeding admin user if configured...");
    await seedAdmin();

    console.log("🎯 Starting job runner...");
    await startJobRunner();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startApp();
