import { Router } from "express";
import { messageController } from "./message.controller";
import { validateBody } from "../shared/validate-body";
import { buyerMessageSchema, creatorMessageSchema, adminDisputeSchema } from "./message.schema";
import { requireAuth, requireMerchant, requireAdmin } from "../auth/auth.middleware";
import { ipRateLimiter } from "../shared/rate-limit";
import { z } from "zod";

const router: Router = Router();

// CUSTOMER (guest) endpoints
router.post(
  "/messages/order/:orderId",
  ipRateLimiter,
  validateBody(buyerMessageSchema),
  messageController.sendBuyerMessage
);

router.get("/messages/order/:orderId", messageController.getBuyerMessages);

// MERCHANT endpoints
router.get(
  "/messages",
  requireAuth,
  requireMerchant,
  messageController.listCreatorConversations
);

router.get(
  "/messages/:conversationId",
  requireAuth,
  requireMerchant,
  messageController.getCreatorConversation
);

router.post(
  "/messages/:conversationId",
  requireAuth,
  requireMerchant,
  ipRateLimiter,
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
adminRouter.use(requireAuth, requireAdmin);
adminRouter.get("/messages", messageController.listAdminConversations);
adminRouter.get("/messages/:conversationId", messageController.getAdminConversation);
adminRouter.patch("/messages/:conversationId/resolve", validateBody(adminDisputeSchema), messageController.resolveDispute);
adminRouter.delete("/messages/:messageId", messageController.softDeleteMessage);

router.use("/admin", adminRouter);

export default router;
