import { PDFDocument } from "pdf-lib";

async function responsiveCSM() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  page.drawText("PNO-SIT-01-F02 CARTA RESPONSIVA DE EQUIPO DE CÓMPUTO", {
    x: 50,
    y: height - 100,
    size: 24,
  });
  return pdfDoc.save();
}

module.exports = { responsiveCSM };
