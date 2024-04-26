import express from "express";
import pdfController from "../controllers/pdf.controller.js";

const router = express.Router();

router.get("/responsiveCSM/:id", pdfController.generateResponsiveCSM);
router.get("/validationInfo/:id", pdfController.validationInfoResponsive);

export default router;
