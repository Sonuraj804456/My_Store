import { Request, Response } from "express";
import { ApiError } from "../shared/api-error";
import { success } from "../shared/response";
import { downloadService } from "./download.service";

export const downloadController = {
  publicDownload: async (req: Request, res: Response) => {
    const token = req.params.token;
    if (typeof token !== "string") throw new ApiError(400, "Invalid token");

    const ip = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent =
      (req.headers["user-agent"] as string) || "unknown";

    const result = await downloadService.resolveToken(
      token,
      String(ip),
      String(userAgent)
    );

    res.json(success(result));
  },

  creatorList: async (req: Request, res: Response) => {
    if (!req.user?.id) throw new ApiError(401, "Unauthorized");
    const productId = req.params.id;
    if (typeof productId !== "string") throw new ApiError(400, "Invalid product id");

    const downloads = await downloadService.listByProductForCreator(
      req.user.id,
      productId
    );

    return res.json(success(downloads));
  },

  getTokenByOrder: async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const orderId = req.params.orderId;
    if (!orderId || typeof orderId !== "string")
      throw new ApiError(400, "Invalid order id");

    const tokenData = await downloadService.getTokenForUser(
      { id: req.user!.id },
      orderId
    );

    res.json(success(tokenData));
  },

  adminList: async (req: Request, res: Response) => {
    const downloads = await downloadService.listAll();
    const sanitized = downloads.map((d) => ({
      orderId: d.orderId,
      productId: d.productId,
      variantId: d.variantId,
      downloadCount: d.downloadCount,
      createdAt: d.createdAt,
    }));
    res.json(success(sanitized));
  },
};
