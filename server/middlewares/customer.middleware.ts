import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error";

export async function customerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    if (!user || user.role !== "customer") {
      throw new CustomError(
        "Unauthorized -- Customer Only!  Caught in middleware",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default customerMiddleware;
