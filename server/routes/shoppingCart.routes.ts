import { Router } from "express";
import {
  createShoppingCart,
  deleteShoppingCart,
  getShoppingCartByUserId,
  getShoppingCarts,
} from "../controllers/shoppingCart.controller";
import authorize from "../middlewares/auth.middleware";
import customerMiddleware from "../middlewares/customer.middleware";

const shoppingCartRouter = Router();

shoppingCartRouter.get("/", authorize, customerMiddleware, getShoppingCarts);

shoppingCartRouter.get(
  "/:id",
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

export default shoppingCartRouter;
