import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };
    error.message = err.message || "Internal Server Error cunt";

    console.log(err);

    if (err.name === "CastError") {
      const message = `Resource not found - ${err.message}`;
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.code === 11000) {
      const message = `Duplicate field value entered`;
      error = new Error(message);
      error.statusCode = 400;
    }

    if (err.name === "ValidationError") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = Object.values(err.errors).map((val: any) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
