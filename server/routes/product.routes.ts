import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import {
  createProduct,
  deleteProduct,
  deleteProductSku,
  getProduct,
  getProducts,
  updateProduct,
  sellProduct,
  receiveStock,
  getProductSku,
  getCategoryProducts,
} from "../controllers/product.controller";
import adminMiddleware from "../middlewares/admin.middleware";

const productRouter = Router();

productRouter.get("/", getProducts);

productRouter.get("/:id", getProduct);

productRouter.get("/category/:category", getCategoryProducts);

productRouter.get("/sku/:sku", getProductSku);

productRouter.post("/", authorize, adminMiddleware, createProduct);

productRouter.patch("/:id", authorize, adminMiddleware, updateProduct);

productRouter.delete("/:id", authorize, adminMiddleware, deleteProduct);

productRouter.delete(
  "/:id/sku/:sku",
  authorize,
  adminMiddleware,
  deleteProductSku
);

productRouter.post("/:id/sku/:sku/sell", sellProduct);

productRouter.post(
  "/:id/sku/:sku/receive",
  authorize,
  adminMiddleware,
  receiveStock
);

export default productRouter;
