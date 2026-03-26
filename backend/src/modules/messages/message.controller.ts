import { Request, Response } from "express";
import { ApiError } from "../shared/api-error";
import { messageService } from "./message.service";
import { validateBody } from "../shared/validate-body";
import {
  buyerMessageSchema,
  creatorMessageSchema,
  adminDisputeSchema,
} from "./message.schema";

export const messageController = {
  sendBuyerMessage: async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId || "");
    if (!orderId) throw new ApiError(400, "orderId is required");

    const { email, phone, content } = req.body;

    const message = await messageService.sendBuyerMessage(orderId, String(email), String(phone), String(content));

    res.status(201).json({ success: true, data: message, error: null });
  },

  getBuyerMessages: async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId || "");
    if (!orderId) throw new ApiError(400, "orderId is required");

    const query = req.query as any;
    const body = req.body as any;
    const email = String(query.email || body.email || "");
    const phone = String(query.phone || body.phone || "");

    if (!email || !phone) {
      throw new ApiError(400, "email and phone are required");
    }

    const result = await messageService.getBuyerMessages(orderId, email, phone);
    res.json({ success: true, data: result, error: null });
  },

  listCreatorConversations: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const conversations = await messageService.listCreatorConversations(userId);
    res.json({ success: true, data: conversations, error: null });
  },

  getCreatorConversation: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const conversationId = String(req.params.conversationId || "");
    if (!conversationId) throw new ApiError(400, "conversationId is required");

    const result = await messageService.getCreatorConversation(conversationId, userId);
    res.json({ success: true, data: result, error: null });
  },

  sendCreatorMessage: async (req: Request, res: Response) => {
    const userId = req.user.id;
    const conversationId = String(req.params.conversationId || "");
    if (!conversationId) throw new ApiError(400, "conversationId is required");
    const { content } = req.body;

    const message = await messageService.sendCreatorMessage(conversationId, userId, String(content));
    res.status(201).json({ success: true, data: message, error: null });
  },

  escalateDispute: async (req: Request, res: Response) => {
    const conversationId = String(req.params.conversationId || "");
    if (!conversationId) throw new ApiError(400, "conversationId is required");

    const { orderId, email, phone } = req.body;
    const updated = await messageService.escalateDispute(conversationId, String(orderId), String(email), String(phone));
    res.json({ success: true, data: updated, error: null });
  },

  listAdminConversations: async (req: Request, res: Response) => {
    const result = await messageService.listAdminConversations(req.query);
    res.json({ success: true, data: result, error: null });
  },

  getAdminConversation: async (req: Request, res: Response) => {
    const conversationId = String(req.params.conversationId || "");
    if (!conversationId) throw new ApiError(400, "conversationId is required");

    const result = await messageService.getAdminConversation(conversationId);
    res.json({ success: true, data: result, error: null });
  },

  resolveDispute: async (req: Request, res: Response) => {
    const conversationId = String(req.params.conversationId || "");
    if (!conversationId) throw new ApiError(400, "conversationId is required");

    const result = await messageService.resolveDispute(conversationId);
    res.json({ success: true, data: result, error: null });
  },

  softDeleteMessage: async (req: Request, res: Response) => {
    const messageId = String(req.params.messageId || "");
    if (!messageId) throw new ApiError(400, "messageId is required");

    const result = await messageService.softDeleteMessage(messageId);
    res.json({ success: true, data: result, error: null });
  },
};
