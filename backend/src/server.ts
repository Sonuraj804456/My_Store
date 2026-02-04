import "dotenv/config";
import app from "./app";
import { userService } from "./modules/auth/auth.service";
import { auth } from "./modules/auth/auth.core";

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
    // Ensure existing user has ADMIN role
    if ((existing as any).role !== "ADMIN") {
      await userService.setRoleByEmail(email, "ADMIN");
      console.log("Admin role updated for existing user:", email);
    }
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
      // After signup, set the role to ADMIN (default is CREATOR)
      await userService.setRoleByEmail(email, "ADMIN");
      console.log("Admin user created:", email);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}


const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});
