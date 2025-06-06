import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../database/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { CustomError } from "../types/error";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const { name, email, password } = req.body;

    const existingUsername = await User.findOne({ name }).session(session);

    if (existingUsername) {
      const error = new CustomError("Username already exists", 409);
      error.statusCode = 409;
      throw error;
    }

    const existingEmail = await User.findOne({ email }).session(session);
    if (existingEmail) {
      const error = new CustomError("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    if (!JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    if (!newUser || newUser.length === 0) {
      res.status(500).json({ message: "Failed to create user" });
    }

    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax", // Changed from strict to lax for better compatibility
      path: "/", // Ensure cookie is available for all paths
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const user = newUser[0];

    await session.commitTransaction();

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
}

/**
 * Authenticates a user using email and password, issues a JWT token, and sets it as an HTTP-only cookie.
 *
 * On successful authentication, responds with user data and the JWT token.
 *
 * @throws {CustomError} If the email does not exist or the password is incorrect.
 * @throws {Error} If the JWT secret is not defined in environment variables.
 */
export async function signIn(req: Request, res: Response, next: NextFunction) {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email }).session(session);

    if (!user) {
      const error = new CustomError("Invalid email or password", 401);
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new CustomError("Invalid email or password", 401);
      throw error;
    }

    if (!JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax", // Changed from strict to lax for better compatibility
      path: "/", // Ensure cookie is available for all paths
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "User signed in successfully",
      user,
      // token,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
}

// Implement signOut functionality
export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    // Clear the token cookie with the same settings that were used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Match the setting used when creating
      sameSite: "lax",
      path: "/", // Make sure the path matches the one used when setting the cookie
    });

    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
}
