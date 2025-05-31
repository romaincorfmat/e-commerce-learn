import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserProfile,
  updateUserInfo,
} from "../controllers/user.controller";
import adminMiddleware from "../middlewares/admin.middleware";

const userRouter = Router();

userRouter.get("/", authorize, adminMiddleware, getAllUsers);

userRouter.get("/me", authorize, getCurrentUser);

userRouter.get("/:id", authorize, getUserProfile);

userRouter.post("/", authorize, adminMiddleware, createUser);

userRouter.put("/:id", authorize, updateUserInfo);

userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
