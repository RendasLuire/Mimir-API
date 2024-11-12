import { Router } from "express";
import token from "../middlewares/auth.js";
import reportsController from "../controllers/reports.controller.js";

const router = Router();

router.get("/", reportsController.test);

router.get("/responsivepc/:id", token.auth, reportsController.responsivePC);

export default router;
