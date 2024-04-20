import express from "express";

const router = express.Router();

router.get("reports/responsiveCSM", generateResponsiveCSM);

module.exports = router;
