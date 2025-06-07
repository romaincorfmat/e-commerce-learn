import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import { getAdminStats } from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.send("GET Admin Route");
});

adminRouter.get("/stats", authorize, adminMiddleware, getAdminStats);
export default adminRouter;
