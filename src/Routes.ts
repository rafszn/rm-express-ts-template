import { Router } from "express";
import AuthRoutes from "./Entities/Auth/routes.js";

const router = Router();

router.use("/auth", AuthRoutes);

export default router;
