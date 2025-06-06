import { Router } from "express";
import {
  createShoppingCart,
  deleteShoppingCart,
  deleteShoppingCartItem,
  getCartStats,
  getShoppingCartByUserId,
  getShoppingCarts,
} from "../controllers/shoppingCart.controller";
import authorize from "../middlewares/auth.middleware";
import customerMiddleware from "../middlewares/customer.middleware";

const shoppingCartRouter = Router();

shoppingCartRouter.get("/", authorize, customerMiddleware, getShoppingCarts);

shoppingCartRouter.get(
  "/stats/:userId",
  authorize,
  customerMiddleware,
  getCartStats
);

shoppingCartRouter.get(
  "/:userId",
  authorize,
  customerMiddleware,
  getShoppingCartByUserId
);

shoppingCartRouter.post("/", authorize, customerMiddleware, createShoppingCart);

shoppingCartRouter.delete(
  "/:id",
  authorize,
  customerMiddleware,
  deleteShoppingCart
);

shoppingCartRouter.delete(
  "/items/:id",
  authorize,
  customerMiddleware,
  deleteShoppingCartItem
);

export default shoppingCartRouter;
