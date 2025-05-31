import { config } from "dotenv";

config({ path: ".env" });

export const { MONGO_DB_URI, PORT, JWT_SECRET } = process.env;
