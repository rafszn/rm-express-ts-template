import { Router } from "express";
import { getAuth } from "./controller.js";
import { createauthSchema } from "./dto.js";
import { validate } from "../../../global/middlewares/validator.js";

const router = Router();

router.get("/", validate(createauthSchema), getAuth);

export default router;
