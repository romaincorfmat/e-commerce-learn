import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../database/models";

// Define a type for the decoded JWT payload
interface DecodedToken {
  userId: string;
}

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        message: "Unauthorized access -- Please Log In",
      });
      return;
    }

    const decoded = jwt.verify(
      token as string,
      JWT_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    req.user = user;

    // Used for debugging
    next();
  } catch (error) {
    let message = "Unauthorized access";

    if (error instanceof jwt.TokenExpiredError) {
      message = "Token expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid token";
    }

    res.status(401).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
}

export default authorize;
