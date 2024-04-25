import Device from "../models/device.model.js";
import registerMovement from "../helpers/movement.helper.js";
import User from "../models/user.model.js";

const showAll = async (req, res) => {
  const { type, page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let devices;
    let devicesCount;
    let message;
    let query = {};

    if (type) {
      query.type = type.toLowerCase();
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { serialNumber: searchRegex },
        { hostname: searchRegex },
        { details: searchRegex },
        { status: searchRegex },
        { "annexed.id": searchRegex },
        { "annexed.number": searchRegex },
        { ubication: searchRegex },
        { type: searchRegex },
        { ip: searchRegex },
        { "user.name": searchRegex },
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

const register = async (req, res) => {
  const { brand, model, serialNumber, type, userTI } = req.body;

  if (!brand || !model || !serialNumber || !type || !userTI) {
    return res.status(400).json({
      data: {},
      message:
        "Los campos Marca, Modelo, Numero de Serie, usuario y tipo son obligatorios.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/)) {
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
    type,
  });

  try {
    const deviceAlreadyExist = await Device.findOne({
      serialNumber: device.serialNumber,
    });

    const internUser = await User.findById(userTI);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    if (deviceAlreadyExist) {
      return res.status(409).json({
        data: {},
        message: `Este ${device.type} ya esta registrada.`,
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
      userTI,
      newDevice.type,
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
    device = await Device.findById(id);
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
  const { userTI } = req.body;

  if (!id || !userTI) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/) || !userTI.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
    });
  }

  if (
    !req.body.brand &&
    !req.body.model &&
    !req.body.serialNumber &&
    !req.body.details &&
    !req.body.status &&
    !req.body.annexed &&
    !req.body.ubication &&
    !req.body.type &&
    !req.body.ip &&
    !req.body.user &&
    !req.body.custom &&
    !req.body.bussinesUnit &&
    !req.body.departament &&
    !req.body.monitor &&
    !req.body.headphones &&
    !req.body.adaptVGA &&
    !req.body.mouse &&
    !req.body.hostname
  ) {
    res.status(400).json({
      data: {},
      message: "Al menos alguno de estos campos debe ser enviado.",
    });
  }

  try {
    const internUser = await User.findById(userTI);

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

    device.hostname = req.body.hostname || device.hostname;
    device.user = req.body.user || device.user;
    device.brand = req.body.brand || device.brand;
    device.model = req.body.model || device.model;
    device.monitor = req.body.monitor || device.monitor;
    device.serialNumber = req.body.serialNumber || device.serialNumber;
    device.details = req.body.details || device.details;
    device.annexed = req.body.annexed || device.annexed;
    device.ubication = req.body.ubication || device.ubication;
    device.status = req.body.status || device.status;
    device.type = req.body.type || device.type;
    device.ip = req.body.ip || device.ip;
    device.custom = req.body.custom || device.custom;
    device.bussinesUnit = req.body.bussinesUnit || device.bussinesUnit;
    device.headphones = req.body.headphones || device.headphones;
    device.adaptVGA = req.body.adaptVGA || device.adaptVGA;
    device.mouse = req.body.mouse || device.mouse;

    const updatedDevice = await device.save();

    if (!updatedDevice) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      userTI,
      updatedDevice.type,
      updatedDevice.serialNumber,
      updatedDevice._id,
      "actualizada",
      device,
      updatedDevice
    );

    res.status(200).json({
      data: updatedDevice,
      message: "Usuario actualizado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const assing = async (req, res) => {
  const { id, user, userTI } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  if (!id || !user || !userTI) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }
};

const unassign = async (req, res) => {
  const { id, userTI } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  if (!id || !userTI) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }
};

export default {
  showAll,
  register,
  showOne,
  updatePatch,
  assing,
  unassign,
};
