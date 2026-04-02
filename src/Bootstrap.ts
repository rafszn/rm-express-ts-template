import App from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cfg from "./global/environment.config.js";
import { initCronJobs } from "./cron-jobs/index.js";
dotenv.config();

async function bootstrap() {
  const app = new App();
  await app.initialize();
  const port = Number(cfg.PORT) || 8080;
  await connectDB();
  initCronJobs();
  app.listen(port);
}

bootstrap();
