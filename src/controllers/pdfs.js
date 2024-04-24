import moment from "moment";
import Device from "../models/device.model.js";
import Person from "../models/person.model.js";
import responsiveCSM from "../services/pdfService.js";

const generateResponsiveCSM = async (req, res) => {
  let device;
  let person;
  let boss;
  let monitor;
  let brandMon;
  let modelMon;
  let snMon;
  let nameBoss;
  let posiBoss;

  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del equipo no es valido.",
      },
    });
  }
  try {
    device = await Device.findById(id);
    const brandPc = device.brand;
    const modelPc = device.model;
    const snPc = device.serialNumber;
    const phisicRef = device.ubication;
    const annexed = device.annexed.number;
    const custom = device.custom;

    person = await Person.findById(device.user.id);
    const name = person.name;
    const deptUser = person.department;
    const unidBuss = "Maver CSM";

    if (device.monitor.id !== "Sin asignar") {
      monitor = await Device.findById(device.monitor.id);
      brandMon = monitor.brand || "N/A";
      modelMon = monitor.model || "N/A";
      snMon = monitor.serialNumber || "N/A";
    } else {
      brandMon = "N/A";
      modelMon = "N/A";
      snMon = "N/A";
    }

    if (person.manager.id !== "unassigned") {
      boss = await Person.findById(person.manager.managerId);
      nameBoss = "algo";
      posiBoss = "algo";
    }

    moment.locale("es");
    const date = moment().format("L");
    const date2 = "Tlaquepaque, Jalisco a " + moment().format("LL");

    const pdfBytes = await responsiveCSM({
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
    });
    res.set("Content-Type", "application/pdf");
    res.status(200).send(pdfBytes);
  } catch (error) {
    return res.status(500).json({
      data: {
        message: error.message,
      },
    });
  }
};

export default generateResponsiveCSM;
