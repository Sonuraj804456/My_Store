import { Router } from "express";
import { messageController } from "./message.controller";
import { validateBody } from "../shared/validate-body";
import { buyerMessageSchema, creatorMessageSchema, adminDisputeSchema } from "./message.schema";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";
import { z } from "zod";

const router: Router = Router();

// BUYER (guest) endpoints
router.post(
  "/messages/order/:orderId",
  validateBody(buyerMessageSchema),
  messageController.sendBuyerMessage
);

router.get("/messages/order/:orderId", messageController.getBuyerMessages);

// CREATOR endpoints
router.get(
  "/messages",
  requireAuth,
  requireRole(Roles.CREATOR),
  messageController.listCreatorConversations
);

router.get(
  "/messages/:conversationId",
  requireAuth,
  requireRole(Roles.CREATOR),
  messageController.getCreatorConversation
);

router.post(
  "/messages/:conversationId",
  requireAuth,
  requireRole(Roles.CREATOR),
  validateBody(creatorMessageSchema),
  messageController.sendCreatorMessage
);

router.patch(
  "/messages/:conversationId/dispute",
  validateBody(z.object({ orderId: z.string().uuid(), email: z.string().email(), phone: z.string().min(6).max(20) })),
  messageController.escalateDispute
);

// ADMIN endpoints
const adminRouter = Router();
adminRouter.use(requireAuth, requireRole(Roles.ADMIN));
adminRouter.get("/messages", messageController.listAdminConversations);
adminRouter.get("/messages/:conversationId", messageController.getAdminConversation);
adminRouter.patch("/messages/:conversationId/resolve", validateBody(adminDisputeSchema), messageController.resolveDispute);
adminRouter.delete("/messages/:messageId", messageController.softDeleteMessage);

router.use("/admin", adminRouter);

export default router;
