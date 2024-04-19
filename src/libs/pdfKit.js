import PDFDocument from "pdfkit";

function buildPDF(dataCallback, endCallback) {
  const doc = new PDFDocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.text("Hello World");

  doc.end();
}
