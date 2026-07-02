import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/http-status-codes.js";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  <T extends z.ZodType>(schema: T, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    if (target === "query") {
      Object.assign(req.query, result.data);
    } else {
      req[target] = result.data;
    }

    next();
  };
