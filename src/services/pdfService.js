import { PageSizes, PDFDocument } from "pdf-lib";

const responsiveCSM = async ({
  date,
  name,
  brandPc,
  modelPc,
  snPc,
  brandMon,
  modelMon,
  snMon,
  annexed,
  phisicRef,
  unidBuss,
  deptUser,
  nameBoss,
  posiBoss,
  date2,
  custom,
}) => {
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
  page.drawText("PNO-SIT-01-F02 CARTA RESPONSIVA DE EQUIPO DE CÓMPUTO", {
    x: marginLeft + 38,
    y: lineSpacing * 50,
    size: titleFontSize,
    font: fontBold,
  });

  page.drawText(`${date}`, {
    x: marginLeft + 185,
    y: lineSpacing * 49,
    size: fontSize,
    font: fontBold,
  });

  page.drawText(
    `El departamento de Tecnologías de la Información hace entrega del siguiente equipo de cómputo en funcionamiento a ${name} con los siguientes datos para su control interno:`,
    {
      x: marginLeft,
      y: lineSpacing * 47,
      size: fontSize,
      maxWidth: marginRight - marginLeft,
      lineHeight: lineSpacing,
      wordBreaks: [" "],
    }
  );
  page.drawText("GABINETE / PORTATIL", {
    x: marginLeft,
    y: lineSpacing * 44,
    lineHeight: lineSpacing,
    maxWidth: marginRight - marginLeft,
    size: fontSize,
    font: fontBold,
  });

  page.drawText(
    `Marca: ${brandPc} \nModelo: ${modelPc} \nNúmero de Serie: ${snPc}`,
    {
      x: marginLeft,
      y: lineSpacing * 43,
      lineHeight: lineSpacing,
      maxWidth: marginRight - marginLeft,
      size: fontSize,
    }
  );
  page.drawText("USO:", {
    x: marginLeft + width / 2,
    y: lineSpacing * 44,
    maxWidth: marginRight - marginLeft,
    size: fontSize,
    font: fontBold,
  });

  const PersonalField = form.createCheckBox("Personal");
  PersonalField.addToPage(page, {
    x: marginLeft + width / 2,
    y: lineSpacing * 43,
    maxWidth: marginRight - marginLeft,
    width: fontSize,
    height: fontSize,
  });
  page.drawText("Personal", {
    x: 12 + (marginLeft + width / 2),
    y: lineSpacing * 43,
    maxWidth: marginRight - marginLeft,
    size: fontSize,
  });
  const CompartidoField = form.createCheckBox("Compartido");
  CompartidoField.addToPage(page, {
    x: marginLeft + width / 2,
    y: lineSpacing * 42,
    maxWidth: marginRight - marginLeft,
    width: fontSize,
    height: fontSize,
  });
  page.drawText("Compartido", {
    x: 12 + (marginLeft + width / 2),
    y: lineSpacing * 42,
    size: fontSize,
  });

  if (custom) {
    PersonalField.check();
  } else {
    CompartidoField.check();
  }
  PersonalField.enableReadOnly();
  CompartidoField.enableReadOnly();

  page.drawText("MONITOR", {
    x: marginLeft,
    y: lineSpacing * 39,
    size: fontSize,
    lineHeight: lineSpacing,
    font: fontBold,
  });
  page.drawText(
    `MARCA: ${brandMon} \nMODELO: ${modelMon} \nNumero de Serie: ${snMon}`,
    {
      x: marginLeft,
      y: lineSpacing * 38,
      size: fontSize,
      lineHeight: lineSpacing,
    }
  );

  page.drawText("ANEXO:", {
    x: marginLeft + width / 2,
    y: lineSpacing * 39,
    lineHeight: lineSpacing,
    size: fontSize,
    font: fontBold,
  });
  page.drawText(`${annexed}`, {
    x: marginLeft + width / 2,
    y: lineSpacing * 38,
    lineHeight: lineSpacing,
    size: fontSize,
  });
  page.drawText(`Referencia fisica: \n${phisicRef}`, {
    x: marginLeft + width / 2,
    y: lineSpacing * 37,
    lineHeight: lineSpacing,
    size: fontSize,
    maxWidth: marginRight - (marginLeft + width / 2),
    wordBreaks: [" "],
  });

  page.drawText(
    `Al firmar esta carta, manifiesto conocer el contenido y alcance de mis responsabilidades descritas en el "Reglamento de uso de correo Interno y Externo", las “Políticas de Uso de Dispositivos de Información” y el “Contrato de confidencialidad de la información”, para el uso de equipo de cómputo.`,
    {
      x: marginLeft,
      y: lineSpacing * 33,
      size: fontSize,
      maxWidth: marginRight - marginLeft,
      lineHeight: lineSpacing,
      wordBreaks: [" "],
    }
  );

  page.drawText(
    `A partir de este momento yo ${name} soy el único responsable del equipo de cómputo asignado y de su buen uso, es mi responsabilidad notificar cualquier cambio de responsable, daño o problema con el mismo; correspondiendo únicamente al departamento de Tecnologías de la Información su mantenimiento.`,
    {
      x: marginLeft,
      y: lineSpacing * 28,
      size: fontSize,
      maxWidth: marginRight - marginLeft,
      lineHeight: lineSpacing,
      wordBreaks: [" "],
    }
  );

  page.drawText(
    "Por último, reconozco que en caso de daño por el mal uso, robo o hurto me obligare a pagar el equipo o el deducible del mismo.",
    {
      x: marginLeft,
      y: lineSpacing * 23,
      size: fontSize,
      maxWidth: marginRight - marginLeft,
      lineHeight: lineSpacing,
      wordBreaks: [" "],
    }
  );

  page.drawText("Usuario responsable del equipo", {
    x: marginLeft + 10,
    y: lineSpacing * 19,
    size: fontSize,
    font: fontBold,
  });

  page.drawLine({
    start: { x: marginLeft, y: lineSpacing * 16 },
    end: { x: marginLeft + 150, y: lineSpacing * 16 },
    thickness: 1,
  });

  page.drawText(`${name}`, {
    x: marginLeft + 5,
    y: lineSpacing * 15,
    size: fontSize,
    lineHeight: lineSpacing,
    font: fontBold,
  });
  page.drawText(`${unidBuss} - ${deptUser}`, {
    x: marginLeft + 5,
    y: lineSpacing * 14,
    size: fontSize,
    lineHeight: lineSpacing,
  });

  page.drawText("Gerente o director responsable", {
    x: marginLeft + width / 2,
    y: lineSpacing * 19,
    size: fontSize,
    font: fontBold,
  });

  page.drawLine({
    start: { x: marginLeft + width / 2, y: lineSpacing * 16 },
    end: { x: marginLeft + width / 2 + 150, y: lineSpacing * 16 },
    thickness: 1,
    maxWidth: marginRight - marginLeft,
  });

  page.drawText(`${nameBoss} \n${posiBoss}`, {
    x: marginLeft + width / 2,
    y: lineSpacing * 15,
    size: fontSize,
    lineHeight: lineSpacing,
    maxWidth: marginRight - (marginLeft + width / 2),
    wordBreaks: [" "],
  });
  page.drawText("Enterado", {
    x: marginLeft + 50,
    y: lineSpacing * 11,
    size: fontSize,
    font: fontBold,
  });

  page.drawLine({
    start: { x: marginLeft, y: lineSpacing * 9 },
    end: { x: marginLeft + 150, y: lineSpacing * 9 },
    thickness: 1,
  });

  page.drawText("Tecnologías de la Información", {
    x: marginLeft + 5,
    y: lineSpacing * 8,
    size: fontSize,
    lineHeight: lineSpacing,
  });
  page.drawText(`${date2}`, {
    x: marginRight - 200,
    y: lineSpacing * 4,
    size: fontSize - 1,
    lineHeight: lineSpacing,
    maxWidth: marginRight - (marginRight - 200),
    wordBreaks: [" "],
  });
  page.drawText("PNO-SIT-01-F02", {
    x: marginLeft,
    y: lineSpacing * 2,
    size: fontSize - 1,
    lineHeight: lineSpacing,
  });
  page.drawText("Versión 03", {
    x: width / 2,
    y: lineSpacing * 2,
    size: fontSize - 1,
    lineHeight: lineSpacing,
  });
  page.drawText("Página 1 de 1", {
    x: marginRight - 80,
    y: lineSpacing * 2,
    size: fontSize - 1,
    lineHeight: lineSpacing,
    maxWidth: marginRight - (marginRight - 80),
    wordBreaks: [" "],
  });
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

export default responsiveCSM;
