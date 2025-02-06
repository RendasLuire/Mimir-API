import { Router } from "express";
import token from "../middlewares/auth.js";
import reportsController from "../controllers/reports.controller.js";

const router = Router();

router.get("/", reportsController.test);

router.get("/responsivepc/:id", token.auth, reportsController.responsivePC);

router.get(
  "/responsivePrint/:id",
  token.auth,
  reportsController.responsivePrint
);

router.get("/checkInfo/:id", token.auth, reportsController.checkInfo);

router.get(
  "/export-csv/devices",
  token.auth,
  reportsController.exportCSVDevices
);

export default router;
