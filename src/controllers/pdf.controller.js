import moment from "moment";
import Device from "../models/device.model.js";
import Person from "../models/person.model.js";
import responsiveCSM from "../services/pdfService.js";

const generateResponsiveCSM = async (req, res) => {
  moment.locale("es");

  let responsive = {
    pc: {
      brand: "",
      model: "",
      serialNumber: "",
    },
    monitor: {
      brand: "",
      model: "",
      serialNumber: "",
    },
    user: {
      name: "",
      department: "",
    },
    boss: {
      name: "",
      position: "",
    },
    unidBuss: "Maver CSM",
    phisicRef: "",
    annexed: "",
    custom: false,
    date: moment().format("L"),
    date2: "Tlaquepaque, Jalisco a " + moment().format("LL"),
  };

  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo es necesario.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
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

    responsive.pc.brand = device.brand;
    responsive.pc.model = device.model;
    responsive.pc.serialNumber = device.serialNumber;
    responsive.phisicRef = device.ubication;
    responsive.annexed = device.annexed.number;
    responsive.custom = device.custom;

    const person = await Person.findById(device.user.id);

    responsive.user.name = person.name;
    responsive.user.department = person.department;

    if (device.monitor.id !== "Sin asignar") {
      const monitor = await Device.findById(device.monitor.id);
      responsive.monitor.brand = monitor.brand || "N/A";
      responsive.monitor.model = monitor.model || "N/A";
      responsive.monitor.serialNumber = monitor.serialNumber || "N/A";
    } else {
      responsive.monitor.brand = "N/A";
      responsive.monitor.model = "N/A";
      responsive.monitor.serialNumber = "N/A";
    }

    if (person.manager.id !== "Sin asignar") {
      const boss = await Person.findById(person.manager.id);
      responsive.boss.name = boss.name;
      responsive.boss.position = boss.position;
    }

    let isValid = true;

    Object.keys(responsive).forEach((key) => {
      if (typeof responsive[key] === "object") {
        Object.keys(responsive[key]).forEach((subKey) => {
          if (responsive[key][subKey] === "") {
            isValid = false;
          }
        });
      } else {
        if (responsive[key] === "") {
          isValid = false;
        }
      }
    });

    if (isValid) {
      const pdfBytes = await responsiveCSM({
        responsive,
      });
      res.set("Content-Type", "application/pdf");
      res.status(200).send(pdfBytes);
    } else {
      return res.status(400).json({
        data: {},
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: responsive,
      message: error.message,
    });
  }
};

const validationInfoResponsive = async (req, res) => {
  const { id } = req.params;
  let monitor;
  let brandMon;
  let modelMon;
  let snMon;

  if (!id) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo es necesario.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
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

    if (
      !device.hostname ||
      !device.serialNumber ||
      !device.brand ||
      !device.model ||
      !device.annexed ||
      !device.user ||
      device.user.id == "Sin asignar" ||
      !device.ubication
    ) {
      return res.status(200).json({
        data: false,
        message: "La informacion del equipo no esta completa.",
      });
    }

    const person = await Person.findById(device.user.id);

    if (!person.name || !person.department) {
      return res.status(200).json({
        data: false,
        message: "La informacion del usuario no esta completa.",
      });
    }

    if (
      !person.manager ||
      !person.manager.id ||
      person.manager.id == "Sin asignar"
    ) {
      return res.status(200).json({
        data: false,
        message: "El usuario no tiene manager.",
      });
    }
    return res.status(200).json({
      data: true,
      message: "La responsiva puede ser creada.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

export default { generateResponsiveCSM, validationInfoResponsive };
