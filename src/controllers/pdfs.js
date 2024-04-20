import pdfLib from "../services/pdfService.js";

const generateResponsiveCSM = async (req, res) => {
  try {
    const pdfDocument = await pdfLib.responsiveCSM;
    res.set("Content-Type", "application/pdf");
    res.send(pdfDocument);
  } catch (error) {
    return res.status(500).json({
      data: {
        message: error.message,
      },
    });
  }
};
