import { Request, Response, NextFunction } from "express";
import { ApiError } from "./api-error";
import { failure } from "./response";

export const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof ApiError ? err.status : 500;
  return res.status(status).json(failure({ message: err.message }));
};
