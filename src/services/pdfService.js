import { PDFDocument } from "pdf-lib";

const drawTextBlock = (page, text, options) => {
  page.drawText(text, {
    x: options.x,
    y: options.y,
    size: options.size || 10,
    font: options.font || options.fontBold,
    maxWidth: options.maxWidth,
    lineHeight: options.lineHeight || 15,
    wordBreaks: [" "],
  });
};

const createCheckboxField = (form, name, page, x, y, fontSize) => {
  const field = form.createCheckBox(name);
  field.addToPage(page, {
    x: x,
    y: y,
    width: fontSize,
    height: fontSize,
  });
  page.drawText(name, {
    x: x + 12,
    y: y,
    size: fontSize,
  });
  return field;
};

const generatePDF = async (responsive, isPrinter = false) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612.0, 792.0]);
  const form = pdfDoc.getForm();
  const { width, height } = page.getSize();
  const fontSize = 10;
  const titleFontSize = 12;
  const marginLeft = 85;
  const marginRight = 527;
  const lineSpacing = 15;
  const fontBold = await pdfDoc.embedFont("Helvetica-Bold");
  const yPos = (lines) => lineSpacing * lines;

  page.drawText(
    `${
      isPrinter
        ? "PNO-SIT-01-F04 CARTA RESPONSIVA DE IMPRESORA"
        : "PNO-SIT-01-F02 CARTA RESPONSIVA DE EQUIPO DE CÓMPUTO"
    }`,
    {
      x: marginLeft + 38,
      y: yPos(50),
      size: titleFontSize,
      font: fontBold,
    }
  );

  drawTextBlock(page, `${responsive.date}`, {
    x: marginLeft + 185,
    y: yPos(49),
    fontBold,
  });

  drawTextBlock(
    page,
    `El departamento de Tecnologías de la Información hace entrega del siguiente ${
      isPrinter ? "equipo de impresión" : "equipo de cómputo"
    } en funcionamiento a ${
      responsive.person.name
    } con los siguientes datos para su control interno:`,
    { x: marginLeft, y: yPos(47), maxWidth: marginRight - marginLeft }
  );

  drawTextBlock(page, `${isPrinter ? "IMPRESORA" : "GABINETE / PORTATIL"}`, {
    x: marginLeft,
    y: yPos(44),
    fontBold,
  });

  drawTextBlock(
    page,
    `Marca: ${responsive.pc.brand}\nModelo: ${responsive.pc.model}\nNúmero de Serie: ${responsive.pc.serialNumber}`,
    { x: marginLeft, y: yPos(43) }
  );

  if (!isPrinter) {
    drawTextBlock(page, "USO:", {
      x: marginLeft + width / 2,
      y: yPos(44),
      fontBold,
    });

    const PersonalField = createCheckboxField(
      form,
      "Personal",
      page,
      marginLeft + width / 2,
      yPos(43),
      fontSize
    );
    const CompartidoField = createCheckboxField(
      form,
      "Compartido",
      page,
      marginLeft + width / 2,
      yPos(42),
      fontSize
    );

    responsive.custom ? PersonalField.check() : CompartidoField.check();
    PersonalField.enableReadOnly();
    CompartidoField.enableReadOnly();

    drawTextBlock(page, "MONITOR", { x: marginLeft, y: yPos(39), fontBold });

    drawTextBlock(
      page,
      `MARCA: ${responsive.monitor.brand}\nMODELO: ${responsive.monitor.model}\nNumero de Serie: ${responsive.monitor.serialNumber}`,
      { x: marginLeft, y: yPos(38) }
    );
  }

  drawTextBlock(page, "ANEXO:", {
    x: marginLeft + width / 2,
    y: yPos(39),
    fontBold,
  });
  drawTextBlock(page, `${responsive.annexed}`, {
    x: marginLeft + width / 2,
    y: yPos(38),
  });
  drawTextBlock(page, "Referencia fisica:", {
    x: marginLeft + width / 2,
    y: yPos(37),
    fontBold,
  });
  drawTextBlock(page, `${responsive.phisicRef}`, {
    x: marginLeft + width / 2,
    y: yPos(36),
    maxWidth: marginRight - (marginLeft + width / 2),
  });

  drawTextBlock(
    page,
    `Al firmar esta carta, manifiesto conocer el contenido y alcance de mis responsabilidades descritas en el "Reglamento de uso de correo Interno y Externo", las “Políticas de Uso de Dispositivos de Información” y el “Contrato de confidencialidad de la información”, para el uso de equipo de ${
      isPrinter ? "impresión" : "cómputo"
    }.`,
    { x: marginLeft, y: yPos(33), maxWidth: marginRight - marginLeft }
  );

  drawTextBlock(
    page,
    `A partir de este momento yo ${
      responsive.person.name
    } soy el único responsable del equipo de ${
      isPrinter ? "impresión" : "cómputo"
    } asignado y de su buen uso, es mi responsabilidad notificar cualquier cambio de responsable, daño o problema con el mismo; correspondiendo únicamente al departamento de Tecnologías de la Información su mantenimiento.`,
    { x: marginLeft, y: yPos(28), maxWidth: marginRight - marginLeft }
  );

  drawTextBlock(
    page,
    "Por último, reconozco que en caso de daño por el mal uso, robo o hurto me obligare a pagar el equipo o el deducible del mismo.",
    { x: marginLeft, y: yPos(23), maxWidth: marginRight - marginLeft }
  );

  drawTextBlock(page, "Usuario responsable del equipo", {
    x: marginLeft + 10,
    y: yPos(19),
    fontBold,
  });

  page.drawLine({
    start: { x: marginLeft, y: yPos(16) },
    end: { x: marginLeft + 150, y: yPos(16) },
    thickness: 1,
  });

  drawTextBlock(page, `${responsive.person.name}`, {
    x: marginLeft + 5,
    y: yPos(15),
    fontBold,
  });
  drawTextBlock(
    page,
    `${responsive.unidBuss} - ${responsive.person.department}`,
    { x: marginLeft + 5, y: yPos(14) }
  );

  drawTextBlock(page, "Gerente o director responsable", {
    x: marginLeft + width / 2,
    y: yPos(19),
    fontBold,
  });

  page.drawLine({
    start: { x: marginLeft + width / 2, y: yPos(16) },
    end: { x: marginLeft + width / 2 + 150, y: yPos(16) },
    thickness: 1,
  });

  drawTextBlock(page, `${responsive.boss.name}`, {
    x: marginLeft + width / 2,
    y: yPos(15),
    fontBold,
    maxWidth: marginRight - (marginLeft + width) / 2 + 3,
  });
  drawTextBlock(page, `${responsive.boss.position}`, {
    x: marginLeft + width / 2,
    y: yPos(14),
    maxWidth: marginRight - (marginLeft + width) / 2,
  });

  drawTextBlock(page, "Enterado", {
    x: marginLeft + 50,
    y: yPos(11),
    fontBold,
  });

  page.drawLine({
    start: { x: marginLeft, y: yPos(9) },
    end: { x: marginLeft + 150, y: yPos(9) },
    thickness: 1,
  });

  drawTextBlock(page, "Tecnologías de la Información", {
    x: marginLeft + 5,
    y: yPos(8),
  });

  drawTextBlock(page, `${responsive.date2}`, {
    x: marginRight - 200,
    y: yPos(4),
    size: fontSize - 1,
  });

  drawTextBlock(page, `${isPrinter ? "PNO-SIT-01-F04" : "PNO-SIT-01-F02"}`, {
    x: marginLeft,
    y: yPos(2),
    size: fontSize - 1,
  });
  drawTextBlock(page, `${isPrinter ? "Versión 02" : "Versión 03"}`, {
    x: width / 2,
    y: yPos(2),
    size: fontSize - 1,
  });
  drawTextBlock(page, "Página 1 de 1", {
    x: marginRight - 80,
    y: yPos(2),
    size: fontSize - 1,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

const responsiveCSM = async ({ responsive }) => generatePDF(responsive, false);

const responsivePrinterCSM = async ({ responsive }) =>
  generatePDF(responsive, true);

export default { responsiveCSM, responsivePrinterCSM };
