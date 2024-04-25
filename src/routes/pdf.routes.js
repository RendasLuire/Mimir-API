import express from "express";
import generateResponsiveCSM from "../controllers/pdf.controller.js";

const router = express.Router();

router.get("/responsiveCSM/:id", generateResponsiveCSM);

export default router;
