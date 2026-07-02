import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.js";
import { apiReference } from "@scalar/express-api-reference";
import { HTTP_STATUS } from "../global/constants/http-status-codes.js";

export const setupSwaggerDocs = (app: Application) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "API Docs",
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  app.use(
    "/docs:v2",
    apiReference({
      spec: {
        content: swaggerSpec,
      },
      theme: "default",
      layout: "classic",
      pageTitle: "API Docs",
    }),
  );

  app.get("/docs.json", (_req, res) => {
    return res.status(HTTP_STATUS.OK).json(swaggerSpec);
  });
};
