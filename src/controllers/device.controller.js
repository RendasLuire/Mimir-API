import Device from "../models/device.model.js";
import registerMovement from "../helpers/movement.helper.js";
import User from "../models/user.model.js";
import Person from "../models/person.model.js";
import moment from "moment/moment.js";

moment.locale("es-mx");

const showAll = async (req, res) => {
  const {
    filter,
    typeDevice,
    page = 1,
    limit = 10,
    search,
    status,
  } = req.query;
  const skip = (page - 1) * limit;

  try {
    let devices;
    let devicesCount;
    let query = {};

    if (typeDevice && filter === "all") {
      query.typeDevice = typeDevice;
    }

    if (filter === "computo") {
      query.typeDevice = {
        $in: ["desktop", "laptop", "tablet"],
      };
    }

    if (filter === "dispositivos") {
      query.typeDevice = {
        $in: ["desktop", "laptop", "tablet", "impresora"],
      };
    }

    if (status) {
      query["status.value"] = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { serialNumber: searchRegex },
        { hostname: searchRegex },
        { details: searchRegex },
        { "status.value": searchRegex },
        { "status.label": searchRegex },
        { "annexed.number": searchRegex },
        { phisicRef: searchRegex },
        { ip: searchRegex },
        { mac: searchRegex },
        { "person.name": searchRegex },
        { "departament.name": searchRegex },
        { "monitor.serialNumber": searchRegex },
        { "comments.content": searchRegex },
      ];
    }
    devices = await Device.find(query).skip(skip).limit(Number(limit));

    devicesCount = await Device.countDocuments(query);

    if (devices.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay dispositivos para mostrar.",
      });
    }

    const totalPages = Math.ceil(devicesCount / limit);

    return res.status(200).json({
      data: devices,
      pagination: {
        totalItems: devicesCount,
        totalPages,
        currentPage: Number(page),
      },
      message: "Lista de dispositivos registrados.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { brand, model, serialNumber, typeDevice, user } = req.body;

  if (!brand || !model || !serialNumber || !typeDevice || !user) {
    return res.status(400).json({
      data: {},
      message:
        "Los campos Marca, Modelo, Numero de Serie, usuario y tipo son obligatorios.",
    });
  }

  if (!user.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del dispositivo no es valido.",
    });
  }

  const device = new Device({
    brand,
    model,
    serialNumber,
    hostname: "MV-" + serialNumber,
    typeDevice,
  });

  try {
    const deviceAlreadyExist = await Device.findOne({
      serialNumber: device.serialNumber,
    });

    const internUser = await User.findById(user);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    if (deviceAlreadyExist) {
      return res.status(409).json({
        data: {},
        message: `Este ${device.typeDevice} ya esta registrada.`,
      });
    }

    const newDevice = await device.save();

    if (!newDevice) {
      res.status(400).json({
        data: {},
        message: "Ocurrio algun problema al registrar el dispositivo.",
      });
    }

    await registerMovement(
      user,
      newDevice.typeDevice,
      newDevice.serialNumber,
      newDevice._id,
      "registrado",
      null,
      newDevice
    );

    res.status(201).json({
      data: newDevice,
      message: "Equipo registrado con exito.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let device;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      data: {},
      message: "Es necesario el ID.",
    });
  }
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del dispositivo no es valido.",
    });
  }

  try {
    device = await Device.findById(id)
      .populate("annexed.id")
      .populate("ubication")
      .populate("person.id")
      .populate("monitor.id");
    if (!device) {
      return res.status(404).json({
        data: {},
        message: "El dispositivo no fue encontrado",
      });
    }

    return res.status(200).json({
      data: device,
      message: "Informacion del dispositivo.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      messaje: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  let device;
  const { id } = req.params;
  const { user } = req.body;

  if (!id || !user) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/) || !user.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
    });
  }

  if (
    !req.body.brand &&
    !req.body.model &&
    !req.body.serialNumber &&
    !req.body.hostname &&
    !req.body.status?.value &&
    !req.body.status?.label &&
    !req.body.details &&
    !req.body.annexed?.number &&
    !req.body.ubication &&
    !req.body.phisicRef &&
    !req.body.typeDevice &&
    !req.body.ip &&
    !req.body.mac &&
    !req.body.person &&
    !req.body.custom &&
    !req.body.bussinesUnit &&
    !req.body.departament &&
    !req.body.headphones &&
    !req.body.adaptVGA &&
    !req.body.mouse
  ) {
    return res.status(400).json({
      data: {},
      message: "Al menos alguno de estos campos debe ser enviado.",
    });
  }

  try {
    const internUser = await User.findById(user);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({
        data: {},
        message: "El equipo no fue encontrado",
      });
    }

    const oldDevice = device;

    device.brand = req.body.brand || device.brand;
    device.model = req.body.model || device.model;
    device.serialNumber = req.body.serialNumber || device.serialNumber;
    device.hostname = req.body.hostname || device.hostname;
    device.details = req.body.details || device.details;
    device.status.value = req.body.status?.value || device.status?.value;
    device.status.label = req.body.status?.label || device.status?.label;
    device.annexed.number = req.body.annexed || device.annexed?.number;
    device.ubication = req.body.ubication || device.ubication;
    device.phisicRef = req.body.phisicRef || device.phisicRef;
    device.typeDevice = req.body.typeDevice || device.typeDevice;
    device.ip = req.body.ip || device.ip;
    device.mac = req.body.mac || device.mac;
    device.person = req.body.person || device.person;
    device.custom = req.body.custom;
    device.bussinesUnit = req.body.bussinesUnit || device.bussinesUnit;
    device.departament = req.body.departament || device.departament;
    device.headphones = req.body.headphones;
    device.adaptVGA = req.body.adaptVGA;
    device.mouse = req.body.mouse;
    device.lastChange = moment();

    const updatedDevice = await device.save();

    if (!updatedDevice) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      user,
      updatedDevice.typeDevice,
      updatedDevice.serialNumber,
      updatedDevice._id,
      "actualizada",
      device,
      oldDevice
    );

    res.status(200).json({
      data: updatedDevice,
      message: "Dispositivo actualizado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const assing = async (req, res) => {
  const { user, person } = req.body;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  if (!id || !user || !person) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }

  try {
    const internUser = await User.findById(user);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({
        data: {},
        message: "El equipo no fue encontrado",
      });
    }

    const userData = await Person.findById(person);

    if (!userData) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    device.person.id = userData._id;
    device.person.name = userData.name;
    device.departament.id = userData.department.id;
    device.departament.name = userData.department.name;
    device.status.value = "asignado";
    device.status.label = "asignado";
    device.lastChange = moment();

    if (device.monitor.serialNumber !== "disponible") {
      const monitor = await Device.findById(device.monitor.id);
      monitor.person.id = userData._id;
      monitor.person.name = userData.name;
      monitor.status.value = "asignado";
      monitor.status.label = "asignado";
      monitor.lastChange = moment();

      const updatedMonitor = await monitor.save();
      if (!updatedMonitor) {
        return res.status(400).json({
          data: {},
          message: "El dispositivo no fue actualizado.",
        });
      }

      await registerMovement(
        user,
        updatedMonitor.typeDevice,
        updatedMonitor.serialNumber,
        updatedMonitor._id,
        "asignada",
        monitor,
        updatedMonitor
      );
    }

    const updatedDevice = await device.save();
    if (!updatedDevice) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      user,
      updatedDevice.typeDevice,
      updatedDevice.serialNumber,
      updatedDevice._id,
      "asignada",
      device,
      updatedDevice
    );

    res.status(200).json({
      data: updatedDevice,
      message: "Dispositivo asignado.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const unassing = async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  if (!id || !user) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }

  try {
    const internUser = await User.findById(user);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({
        data: {},
        message: "El equipo no fue encontrado",
      });
    }

    device.user.id = null;
    device.user.name = "disponible";
    device.departament.id = null;
    device.departament.name = "disponible";
    device.status.label = "disponible";
    device.status.value = "disponible";
    device.lastChange = moment();

    if (device.monitor.id !== "disponible") {
      const monitor = await Device.findById(device.monitor.id);
      monitor.user.id = null;
      monitor.user.name = "disponible";
      monitor.status.value = "disponible";
      monitor.status.label = "disponible";
      monitor.lastChange = moment();

      const updatedMonitor = await monitor.save();
      if (!updatedMonitor) {
        return res.status(400).json({
          data: {},
          message: "El dispositivo no fue actualizado.",
        });
      }

      await registerMovement(
        user,
        updatedMonitor.typeDevice,
        updatedMonitor.serialNumber,
        updatedMonitor._id,
        "liberado",
        monitor,
        updatedMonitor
      );
    }

    const updatedDevice = await device.save();
    if (!updatedDevice) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      user,
      updatedDevice.typeDevice,
      updatedDevice.serialNumber,
      updatedDevice._id,
      "liberado",
      device,
      updatedDevice
    );

    res.status(200).json({
      data: updatedDevice,
      message: "Dispositivo liberado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const assingMonitor = async (req, res) => {
  const { user, monitorId } = req.body;
  const { id } = req.params;

  if (!monitorId || !id || !user) {
    return res.status(404).json({
      data: {
        monitor: monitorId,
        device: id,
        user,
      },
      message: "La informacion no esta completa.",
    });
  }

  if (
    !id.match(/^[0-9a-fA-F]{24}$/) ||
    !monitorId.match(/^[0-9a-fA-F]{24}$/) ||
    !user.match(/^[0-9a-fA-F]{24}$/)
  ) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        data: id,
        message: "El dispositivo no fue encontrado.",
      });
    }

    const monitor = await Device.findById(monitorId);

    if (!monitor) {
      return res.status(404).json({
        data: monitor,
        message: "El monitor no fue encontrado.",
      });
    }

    if (monitor.typeDevice !== "monitor") {
      return res.status(404).json({
        data: monitor,
        message: "Solo se pueden asignar monitores.",
      });
    }

    device.monitor.id = monitor._id;
    device.monitor.serialNumber = monitor.serialNumber;
    device.lastChange = moment();

    await device.save();

    monitor.person.id = device.person.id;
    monitor.person.name = device.person.name;
    monitor.status.value = "asignado";
    monitor.status.label = "asignado";
    monitor.lastChange = moment();

    await monitor.save();

    return res.status(200).json({
      data: device,
      message: "El monitor fue asignado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: "Server Error: " + error,
    });
  }
};

const unassingMonitor = async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/) || !user.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        data: id,
        message: "No se encontro el dispositivo.",
      });
    }

    const monitor = await Device.findById(device.monitor.id);

    if (!monitor) {
      return res.status(404).json({
        data: device.monitor,
        message: "No se encuentra el monitor.",
      });
    }

    monitor.person = {
      name: "disponible",
    };
    monitor.status.label = "disponible";
    monitor.status.value = "disponible";
    monitor.lastChange = moment();

    await monitor.save();

    device.monitor = {
      serialNumber: "disponible",
    };
    device.lastChange = moment();

    await device.save();

    return res.status(200).json({
      data: device,
      message: "Listo",
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({
      data: {},
      message: "Existe un error: ",
      error,
    });
  }
};

const ShowMonitors = async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let devices;
    let devicesCount;
    let query;

    if (!status) {
      query = {
        typeDevice: "monitor",
      };
    } else {
      query = {
        typeDevice: "monitor",
        "status.value": status,
      };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { serialNumber: searchRegex },
        { hostname: searchRegex },
        { details: searchRegex },
        { "annexed.number": searchRegex },
        { phisicRef: searchRegex },
        { ip: searchRegex },
        { mac: searchRegex },
        { "person.name": searchRegex },
        { "departament.name": searchRegex },
        { "monitor.serialNumber": searchRegex },
      ];
    }
    devices = await Device.find(query).skip(skip).limit(Number(limit));

    devicesCount = await Device.countDocuments(query);

    if (devices.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay dispositivos para mostrar.",
      });
    }

    const totalPages = Math.ceil(devicesCount / limit);

    return res.status(200).json({
      data: devices,
      pagination: {
        totalItems: devicesCount,
        totalPages,
        currentPage: Number(page),
      },
      message: "Lista de dispositivos registrados.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const ShowPrinters = async (req, res) => {
  const { status, page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let printers;
    let printersCount;
    let query;

    if (!status) {
      query = {
        typeDevice: "impresora",
      };
    } else {
      query = {
        typeDevice: "impresora",
        "status.value": status,
      };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { serialNumber: searchRegex },
        { hostname: searchRegex },
        { details: searchRegex },
        { "annexed.number": searchRegex },
        { phisicRef: searchRegex },
        { ip: searchRegex },
        { mac: searchRegex },
        { "person.name": searchRegex },
        { "departament.name": searchRegex },
        { "monitor.serialNumber": searchRegex },
      ];
    }

    printers = await Device.find(query).skip(skip).limit(Number(limit));
    printersCount = await Device.countDocuments(query);

    if (printers.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay impresoras para mostrar.",
      });
    }

    const totalPages = Math.ceil(printersCount / limit);

    return res.status(200).json({
      data: printers,
      pagination: {
        totalItems: printersCount,
        totalPages,
        currentPage: Number(page),
      },
      message: "Lista de impresoras registradas.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const listComments = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await Device.findById(id).populate(
      "comments.idUser",
      "name"
    );

    if (!device) {
      return res.status(404).json({
        data: [],
        message: "Dispositivo no encontrado.",
      });
    }

    return res.status(200).json({
      data: device.comments,
      message: "Lista de comentarios.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { user, nameUser, content } = req.body;

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        data: {},
        message: "Dispositivo no encontrado.",
      });
    }

    const newComment = {
      user,
      nameUser,
      dateCreation: moment(),
      content,
    };

    device.comments.push(newComment);
    await device.save();

    return res.status(201).json({
      data: newComment,
      message: "Comentario añadido exitosamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        data: {},
        message: "Dispositivo no encontrado.",
      });
    }

    const commentIndex = device.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        data: {},
        message: "Comentario no encontrado.",
      });
    }

    device.comments.splice(commentIndex, 1);
    await device.save();

    return res.status(200).json({
      data: {},
      message: "Comentario eliminado exitosamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

export default {
  showAll,
  register,
  showOne,
  updatePatch,
  assing,
  unassing,
  assingMonitor,
  unassingMonitor,
  ShowMonitors,
  ShowPrinters,
  listComments,
  addComment,
  deleteComment,
};
