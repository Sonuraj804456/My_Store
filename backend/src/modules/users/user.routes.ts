
import { requireAuth } from "../auth/auth.middleware";
import { getMe } from "./user.controller";

import { Router, type Request, type Response } from "express";

const router: Router = Router();

router.get("/me", requireAuth, getMe);

export default router;
