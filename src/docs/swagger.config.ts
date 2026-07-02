import swaggerJSDoc from "swagger-jsdoc";
import cfg from "../global/environment.config.js";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "API",
      version: "1.0.0",
      description:
        "API documentation",
    },

    servers: [
      {
        url: `http://localhost:${cfg.PORT}/v1`,
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description:
          "Authentication",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["src/core/Modules/**/*.ts", "dist/core/Modules/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
