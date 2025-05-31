import { NextFunction, Request, Response } from "express";
import { User } from "../database/models";
import { generateEmail, generatePassword } from "../utils/utils";
import bcrypt from "bcrypt";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select("-password");
    console.log("Fetched users:", users.length, "users found");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const currentUser = await User.findById(req.user.id).select("-password");

    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      res.status(400).json({ message: "Name and role are required" });
    }

    if (role && role !== "admin" && role !== "user") {
      res.status(400).json({ message: "Invalid role specified" });
    }

    const email = generateEmail(name);
    const password = generatePassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role, // Default to 'user' if no role is provided
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { newUser, password },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user?.id;

    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userId !== loggedInUser) {
      res
        .status(400)
        .json({ message: "You cannot delete someone else account." });
      return;
    }

    const userToDelete = await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: userToDelete,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function updateUserInfo(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user;
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }

    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (loggedInUser.role !== "admin") {
      res.status(403).json({ message: "Only Admin can update user info" });
      return;
    }

    const { name, email, role } = req.body;

    if (role && role !== "admin" && role !== "user") {
      res.status(400).json({ message: "Invalid role specified" });
      return;
    }

    const userToUpdate = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        role,
      },
      { new: true }
    ).select("-password");

    if (!userToUpdate) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User info updated successfully",
      data: userToUpdate,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
