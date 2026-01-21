import "dotenv/config";
import app from "./app";
import { userService } from "./modules/auth/auth.service";
import { auth } from "./modules/auth/auth.core";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await userService.getByEmail(email);
  if (existing) return;

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
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});
