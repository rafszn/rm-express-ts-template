import { Router } from "express";
import AuthRoutes from "./core/Modules/Auth/routes.js";

const router = Router();

router.use("/auths", AuthRoutes);
export default router;
