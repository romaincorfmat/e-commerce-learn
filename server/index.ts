import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import { PORT } from "./config/env";
import connectToDatabase from "./database/dbConnect";
import errorMiddleware from "./middlewares/error.middleware";
import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";
import shoppingCartRouter from "./routes/shoppingCart.routes";
import loggerMiddleware from "./middlewares/logger.middleware";
import orderRoutes from "./routes/order.routes";
import adminRouter from "./routes/admin.routes";

const app = express();
const port = PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/shopping-carts", shoppingCartRouter);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admins", adminRouter);

app.use(errorMiddleware);
app.get("/", (req, res) => {
  console.log("Received a request at /");
  res.send("Hello, World!");
});

app.listen(port, () => {
  connectToDatabase();
  console.log(`Server API running on port ${port}`);
});
