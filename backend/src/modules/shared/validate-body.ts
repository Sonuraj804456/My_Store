import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "./api-error";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        JSON.stringify(parsed.error.flatten())
      );
    }

    req.body = parsed.data;
    next();
  };
