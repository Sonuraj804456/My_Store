import { Request, Response } from "express";
import { asyncHandler } from "../shared/async-handler";
import { success } from "../shared/response";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  return res.json(
    success({ id: req.user!.id, email: req.user!.email, role: req.user!.role })
  );
});
