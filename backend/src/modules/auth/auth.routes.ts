import { Router, Express } from "express";
import { login, register, me } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

export default router;
