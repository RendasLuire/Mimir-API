import fs from "fs";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import path from "path";
import Person from "../models/person.model.js";
import Device from "../models/device.model.js";
import moment from "moment";

moment.locale("es");

function capitalizeFirstLetterOfEachWord(str) {
  return str.replace(/(?:^|\s|["'([{])+\S/g, function (char) {
    return char.toUpperCase();
  });
}

const test = async (req, res) => {
  try {
    const templatePath = path.resolve("./src/helpers/csm.responsive.hbs");

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(source);

    const dynamic = {
      userName: "",
      shortDate: "",
      brandPc: "",
      modelPc: "",
      serialNumberPc: "",
      brandMon: "N/A",
      modelMon: "N/A",
      serialNumberMon: "N/A",
      personal: false,
      nopersonal: true,
      anexo: "",
      refPhisic: "",
      unitBussiness: "",
      department: "",
      bossName: "",
      bossPosition: "",
      longdate: "",
    };
    const htmlContent = template(dynamic);

    if (!htmlContent) {
      throw new Error("Generated HTML content is empty");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "letter",
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Generated PDF buffer is empty");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.end(pdfBuffer, "binary");
  } catch (error) {
    console.error("Error generating PDF", error);
    res.status(500).send("Error generating PDF");
  }
};

const responsivePC = async (req, res) => {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es válido o es necesario.",
    });
  }

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        data: {},
        message: "El equipo no existe.",
      });
    }

    const person = await Person.findById(device.person.id);
    const boss =
      device.person.id !== "Sin asignar"
        ? await Person.findById(person.manager.id)
        : {};
    let monitor;
    if (device.monitor.serialNumber !== "disponible") {
      monitor = await Device.findById(device.monitor.id);
    } else {
      monitor = {
        serialNumber: "N/A",
        brand: "N/A",
        model: "N/A",
      };
    }

    const dynamic = {
      userName: person.name,
      shortDate: moment(device.lastChange).format("L"),
      brandPc: device.brand,
      modelPc: device.model,
      serialNumberPc: device.serialNumber.toUpperCase(),
      brandMon: monitor.brand,
      modelMon: monitor.model,
      serialNumberMon: monitor.serialNumber.toUpperCase(),
      personal: device.custom,
      nopersonal: !device.custom,
      anexo: device.annexed.number,
      refPhisic: device.phisicRef,
      unitBussiness: "",
      department: person.department.name,
      bossName: boss.name,
      bossPosition: boss.position,
      longDate: `Tlaquepaque, Jalisco a ${moment(device.lastChange).format(
        "LL"
      )}`,
    };

    const templatePath = path.resolve("./src/helpers/csm.responsive.hbs");

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(source);

    const htmlContent = template(dynamic);

    if (!htmlContent) {
      throw new Error("Generated HTML content is empty");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "letter",
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Generated PDF buffer is empty");
    }

    const fileName = `${dynamic.serialNumberPc} - ${dynamic.userName}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.end(pdfBuffer, "binary");
  } catch (error) {
    console.error("Error generating PDF", error);
    res.status(500).send("Error generating PDF");
  }
};

export default {
  test,
  responsivePC,
};
