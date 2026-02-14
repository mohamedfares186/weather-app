import { Router } from "express";
import weatherController from "../controllers/weatherController.mjs";

const router = Router();

router.get("/weather", weatherController);

export default router;
