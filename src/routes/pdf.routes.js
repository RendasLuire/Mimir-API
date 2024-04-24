import express from "express";
import generateResponsiveCSM from "../controllers/pdfs.js";

const router = express.Router();

router.get("/responsiveCSM/:id", generateResponsiveCSM);

export default router;
