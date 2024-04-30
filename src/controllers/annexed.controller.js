import registerMovement from "../helpers/movement.helper.js";
import Annexed from "../models/annexed.model.js";
import User from "../models/user.model.js";
import Device from "../models/device.model.js";
import User from "../models/U.model.js";

const showAll = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let annexeds;
    let annexedCount;
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { annexedNumber: searchRegex },
        { startDate: searchRegex },
        { endDate: searchRegex },
        { "device.id": searchRegex },
        { "device.serialNumber": searchRegex },
        { bill: searchRegex },
      ];
    }

    annexeds = await Annexed.find(query).skip(skip).limit(Number(limit));
    annexedCount = await Annexed.countDocuments(query);

    if (annexeds.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay anexos registrados.",
      });
    }

    const totalPages = Math.ceil(annexedCount / limit);

    return res.status(200).json({
      data: annexeds,
      pagination: {
        totalItems: annexedCount,
        totalPages,
        currenPage: Number(page),
      },
      message: "Lista de anexos registrado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { annexedNumber, startDate, endDate, bill, userTI } = req.body;

  if (!annexedNumber || !userTI || !bill) {
    return res.status(400).json({
      data: {},
      message: "Los campos son obligatorios.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del usuario no es valido.",
    });
  }

  const annexed = new Annexed({
    annexedNumber,
    startDate,
    endDate,
    bill,
  });

  try {
    const userData = await User.findById(userTI);

    if (!userData) {
      return res.status(404).json({
        data: {},
        message: "El ID del usuario no es valido.",
      });
    }
    const newAnnexed = await annexed.save();

    if (!newAnnexed) {
      res.status(400).json({
        data: {},
        message: "Ocurrio algun problema al registrar el anexo.",
      });
    }

    await registerMovement(
      userTI,
      "annexo",
      newAnnexed.annexedNumber,
      newAnnexed._id,
      "registrado",
      null,
      newAnnexed
    );

    res.status(201).json({
      data: newAnnexed,
      message: "El anexo fue registrado con exito.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let annexed;
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
    annexed = await Annexed.findById(id);
    if (!annexed) {
      return res.status(404).json({
        data: {},
        message: "",
      });
    }

    return res.status(200).json({
      data: annexed,
      message: "Informacion del anexo.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      messaje: error.message,
    });
  }
};

const masiveRegister = async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    model,
    description,
    type,
    serialNumber,
    unitValue,
    tax,
    amount,
    userTI,
    bill,
  } = req.body;

  if (
    !userTI ||
    !brand ||
    !model ||
    !description ||
    !type ||
    !serialNumber ||
    !unitValue ||
    !tax ||
    !amount ||
    !bill
  ) {
    return res.status(400).json({
      data: {},
      message: "Los campos son obligatorios.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del dispositivo no es valido.",
    });
  }

  const annexed = await Annexed.findById(id);

  if (!annexed) {
    return res.status(404).json({
      data: {},
      message: "El anexo no existe.",
    });
  }

  if (!serialNumber || serialNumber.length === 0) {
    return res.status(400).json({
      data: {},
      message: "Se requiere al menos un número de serie.",
    });
  }

  const createdDevices = [];
  const serialNumbersArray = serialNumber.split(", ");
  for (const sn of serialNumbersArray) {
    let device = await Device.findOne({ serialNumber: sn });

    if (!device) {
      device = new Device({
        brand,
        model,
        annexed: {
          id: id,
          number: annexed.annexedNumber,
        },
        details: description,
        type,
        serialNumber: sn,
        hostname: "MV-" + sn,
        unitValue,
        tax,
        amount,
        userTI,
        bill,
      });

      await registerMovement(
        userTI,
        device.type,
        device.serialNumber,
        device._id,
        "registrado",
        null,
        device
      );

      await device.save();
      createdDevices.push(device);
    } else {
      const deviceOld = device;

      device.brand = brand;
      device.model = model;
      device.details = description;
      (device.annexed.id = annexed._id),
        (device.annexed.number = annexed.annexedNumber),
        (device.type = type);
      device.unitValue = unitValue;
      device.tax = tax;
      device.amount = amount;
      device.bill = bill;

      await registerMovement(
        userTI,
        device.type,
        device.serialNumber,
        device._id,
        "actualizada",
        deviceOld,
        device
      );

      await device.save();
      createdDevices.push(device);
    }
  }

  annexed.devices.push(
    ...createdDevices.map((d) => ({
      id: d._id,
      serialNumber: d.serialNumber,
      unitValue,
      tax,
      amount,
    }))
  );
  await annexed.save();

  res.status(200).json({
    message: "Equipos registrados exitosamente.",
    data: createdDevices,
  });
};

const updatePatch = async (req, res) => {
  const { id } = req.params;
  const { annexedNumber, startDate, endDate, bill, userTI } = req.body;

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

  if (!annexedNumber || !startDate || !endDate || !bill) {
    return res.status(400).json({
      data: {},
      message: "Es necesario ingresar algun dato.",
    });
  }

  try {
    const user = await User.findById(userTI);
    if (!user) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    let annexed = await Annexed.findById(id);
    if (!annexed) {
      return res.status(404).json({
        data: {},
        message: "El anexo no fue encontrado",
      });
    }

    annexed.annexedNumber = annexedNumber || annexed.annexedNumber;
    annexed.startDate = startDate || annexed.startDate;
    annexed.endDate = endDate || annexed.endDate;
    annexed.bill = bill || annexed.bill;
  } catch (error) {}
};

export default {
  showAll,
  showOne,
  register,
  masiveRegister,
};
