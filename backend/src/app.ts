import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { errorHandler } from "./modules/shared/error-handler";

import express, { type Express } from "express";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// API prefix
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/users", userRoutes);

app.use(errorHandler);

export default app;
