import moment from "moment";
import Device from "../models/device.model.js";
import Person from "../models/person.model.js";
import responsiveService from "../services/pdfService.js";

function capitalizeFirstLetterOfEachWord(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

const generateResponsiveCSM = async (req, res) => {
  moment.locale("es");

  const initialResponsive = {
    pc: { brand: "", model: "", serialNumber: "" },
    monitor: { brand: "N/A", model: "N/A", serialNumber: "N/A" },
    person: { name: "", department: "" },
    boss: { name: "", position: "" },
    unidBuss: "Maver CSM",
    phisicRef: "",
    annexed: "",
    custom: false,
  };

  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es válido o es necesario.",
    });
  }

  try {
    const device = await Device.findById(id);
    if (!device)
      return res
        .status(404)
        .json({ data: {}, message: "El equipo no existe." });

    const person = await Person.findById(device.person.id);
    const boss =
      device.person.id !== "Sin asignar"
        ? await Person.findById(person.manager.id)
        : {};

    const responsive = {
      ...initialResponsive,
      pc: {
        brand: device.brand,
        model: device.model,
        serialNumber: device.serialNumber.toUpperCase(),
      },
      phisicRef: device.phisicRef,
      annexed: device.annexed.number,
      custom: device.custom,
      person: {
        name: capitalizeFirstLetterOfEachWord(person.name),
        department: person.department.name,
      },
      boss: {
        name: capitalizeFirstLetterOfEachWord(boss.name) || "",
        position: boss.position || "",
      },
      monitor:
        device.monitor.serialNumber !== "disponible"
          ? await getMonitorDetails(device.monitor.id)
          : initialResponsive.monitor,

      date: moment(device.lastChange).format("L"),
      date2: `Tlaquepaque, Jalisco a ${moment(device.lastChange).format("LL")}`,
    };

    const isValid = validateResponsive(responsive);

    if (isValid) {
      responsive.annexed =
        responsive.annexed && responsive.annexed !== "disponible"
          ? responsive.annexed
          : "";
      const pdfBytes = await generatePdf(
        responsive,
        device.typeDevice,
        responsive.unidBuss
      );

      res.set("Content-Type", "application/pdf");
      return res.status(200).send(pdfBytes);
    } else {
      return res.status(400).json({
        data: {},
        message: "Información incompleta en el responsivo.",
      });
    }
  } catch (error) {
    return res.status(500).json({ data: {}, message: error.message });
  }
};

const validateResponsive = (responsive) => {
  return Object.keys(responsive).every((key) => {
    if (typeof responsive[key] === "object") {
      return Object.values(responsive[key]).every((value) => value !== "");
    }
    return responsive[key] !== "";
  });
};

const getMonitorDetails = async (monitorId) => {
  const monitor = await Device.findById(monitorId);
  return {
    brand: monitor.brand || "N/A",
    model: monitor.model || "N/A",
    serialNumber: monitor.serialNumber.toUpperCase() || "N/A",
  };
};

const generatePdf = async (responsive, typeDevice, unidBuss) => {
  if (typeDevice === "impresora" && unidBuss === "Maver CSM") {
    return await responsiveService.responsivePrinterCSM({ responsive });
  } else if (unidBuss === "Maver CSM") {
    return await responsiveService.responsiveCSM({ responsive });
  } else if (typeDevice === "impresora" && unidBuss === "Maver") {
    return await responsiveService.responsivePrinterAlamo({ responsive });
  } else if (unidBuss === "Maver") {
    return await responsiveService.responsiveAlamo({ responsive });
  }
};

const validationInfoResponsive = async (req, res) => {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: false,
      message: "El ID del equipo no es válido o es necesario.",
    });
  }

  try {
    const device = await Device.findById(id);
    if (!device)
      return res
        .status(404)
        .json({ data: false, message: "El equipo no existe." });

    if (device.person.id === "available") {
      return res
        .status(200)
        .json({ data: false, message: "El equipo no esta asignado." });
    }
    const person = await Person.findById(device.person.id);

    const isComplete = [
      device.hostname,
      device.serialNumber,
      device.brand,
      device.model,
      device.annexed.number,
      device.person.name,
      device.phisicRef,
      person.name,
      person.department.name,
      person.manager.name,
    ].every(Boolean);

    return res.status(200).json({
      data: isComplete,
      message: isComplete
        ? "La responsiva puede ser creada."
        : "La información del equipo o usuario no está completa.",
    });
  } catch (error) {
    return res.status(500).json({ data: false, message: error.message });
  }
};

export default { generateResponsiveCSM, validationInfoResponsive };
