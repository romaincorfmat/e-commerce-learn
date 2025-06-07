import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import customerMiddleware from "../middlewares/customer.middleware";
import {
  createOrder,
  getOrderByUserId,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import adminMiddleware from "../middlewares/admin.middleware";

const orderRoutes = Router();

orderRoutes.get("/", authorize, adminMiddleware, getOrders);

orderRoutes.get("/:userId", authorize, customerMiddleware, getOrderByUserId);

orderRoutes.post("/create", authorize, customerMiddleware, createOrder);

orderRoutes.put(
  "/update-status/:orderId",
  authorize,
  adminMiddleware,
  updateOrderStatus
);

orderRoutes.delete("/cancel", async (req, res) => {
  res.send("Order routes are working");
});

export default orderRoutes;
