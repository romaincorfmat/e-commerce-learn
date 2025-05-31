import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
} from "../controllers/category.controller";
import authorize from "../middlewares/auth.middleware";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);

categoryRouter.get("/:id", getCategory);

categoryRouter.post("/", authorize, createCategory);

categoryRouter.put("/:id", (req, res) => {
  res.send("Update category");
});

categoryRouter.delete("/:id", authorize, deleteCategory);

export default categoryRouter;
