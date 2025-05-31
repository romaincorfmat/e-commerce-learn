import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      throw new CustomError(
        "Unauthorized -- Admin Only!  Caught in middleware",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default adminMiddleware;
