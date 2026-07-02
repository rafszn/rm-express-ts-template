import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../library/gen-token.js";
import { HTTP_STATUS } from "../constants/http-status-codes.js";
import fingerprintRequest from "../library/fingerprintRequest.js";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const fingerprint = req.cookies["__Secure-fp"];
  const { authorization: cookie } = req.headers;
  if (!cookie || !cookie.startsWith("Bearer ")) {
    return null;
  }
  const token = cookie.split(" ")[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "unauthorized:missing",
    });
  }
  if (!fingerprint) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "unauthorized:missing:fp",
    });
  }

  try {
    const payload = verifyAccessToken(token);
    const { fingerprintHash } = fingerprintRequest(fingerprint);

    if (payload.fp !== fingerprintHash) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "unauthorized:mismatch",
      });
    }

    req.user = payload;
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "unauthorized:invalid",
    });
  }
  next();
};

export default authenticate;
