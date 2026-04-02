import crypto from "crypto";
import { Request } from "express";

const fingerprintRequest = (req: Request): string => {
  const ua = req.headers["user-agent"] ?? "";
  const ip = req.ip ?? "";

  return crypto
    .createHash("sha256")
    .update(`${ua}:${ip}`)
    .digest("hex")
    .slice(0, 16);
};

export default fingerprintRequest;
