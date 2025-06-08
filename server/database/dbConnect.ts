import mongoose from "mongoose";
import { MONGO_DB_URI } from "../config/env";

async function connectToDatabase() {
  if (!MONGO_DB_URI) {
    throw new Error(
      "MONGO_DB_URI is not defined in the environment variables."
    );
  }

  const dbUri: string = MONGO_DB_URI as string;

  try {
    await mongoose.connect(dbUri, {
      dbName: "e-commerce",
    });

    console.info("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

export default connectToDatabase;
