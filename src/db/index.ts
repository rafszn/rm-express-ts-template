import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../config.js";
import cfg from "../global/environment.config.js";

dotenv.config();
const MAX_RETRIES = 15;
const RETRY_INTERVAL_MS = 7_000; //7 seconds

const connectDB = async () => {
  const mongoUri = cfg.MONG0_URL;

  if (!mongoUri) {
    logger.error(
      "MONGO_URL is not defined in environment variables. Database not connected",
    );
    return;
  }

  if (mongoose.connection.readyState !== 0) {
    logger.info("MongoDB already connected.");
    return;
  }

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      if (attempt > 1) {
        logger.info(
          `MongoDB connection attempt ${attempt} of ${MAX_RETRIES}...`,
        );
      }

      await mongoose.connect(mongoUri, {
        autoIndex: true,
        maxPoolSize: 30,
        minPoolSize: 0,
      });

      const models = Object.values(mongoose.models);
      await Promise.all(models.map((model) => model.syncIndexes()));
      logger.info("MongoDB connected & synced successfully.");

      return; // success — exit the loop
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`MongoDB connection attempt ${attempt} failed: ${errMsg}`);

      if (attempt >= MAX_RETRIES) {
        logger.error(
          `All ${MAX_RETRIES} connection attempts exhausted. Shutting down.`,
        );
        process.exit(1);
      }

      logger.info(`Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }
};

export default connectDB;
