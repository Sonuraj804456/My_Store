import cors from "cors";
import express, { type Express } from "express";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import storeRoutes from "./modules/stores/store.routes";
import adminStoreRoutes from "./modules/stores/store.admin.routes";
import productRoutes from "./modules/products/product.routes";
import productPublicRoutes from "./modules/products/product.public.routes";
import orderRoutes from "./modules/orders/order.routes"; // 👈 ADD

import { errorHandler } from "./modules/shared/error-handler";

const app: Express = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* =========================
   API ROUTES
========================= */

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/users", userRoutes);
app.use("/v1/api/stores", storeRoutes);
app.use("/v1/api/products", productRoutes);
app.use("/v1/api", productPublicRoutes);
app.use("/v1/api", orderRoutes); // 👈 ADD THIS
app.use("/v1/api/admin", adminStoreRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

export default app;