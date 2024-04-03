import moment from "moment";
import Computer from "../models/computer.model.js";
import Movement from "../models/movement.model.js";
import User from "../models/user.model.js";
const showAll = async (req, res) => {
  try {
    const computers = await Computer.find();
    if (computers.length === 0) {
      return res.status(204).json([]);
    }
    return res.json(computers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { brand, model, serialNumber, type, user } = req.body;

  if (!brand || !model || !serialNumber || !type || !user) {
    return res.status(400).json({
      message:
        "Los campos Marca, Modelo, Numero de Serie, usuario y tipo son obligatorios.",
    });
  }

  const computer = new Computer({
    brand,
    model,
    serialNumber,
    type,
    user: "",
    status: "available",
    hostname: "MV-" + serialNumber,
  });

  try {
    const computerAlreadyExist = await Computer.findOne({
      serialNumber: computer.serialNumber,
    });

    if (computerAlreadyExist) {
      return res.status(409).json({
        message: `Esta ${computer.type} ya esta registrada.`,
      });
    }

    const newComputer = await computer.save();

    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    const userData = await User.findById(user);
    const description =
      "Computer registered " +
      newComputer.serialNumber +
      " on " +
      date +
      " by user: " +
      userData.name +
      " .";

    const movement = new Movement({
      user,
      computer: newComputer._id,
      type: "computer",
      date,
      description,
    });

    const newMovement = await movement.save();

    res.status(201).json({
      computer: newComputer,
      movement: newMovement,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del equipo no es valido.",
    });
  }

  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        message: "El equipo no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      messaje: error.message,
    });
  }

  return res.status(200).json(computer);
};

const updatePut = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del equipo no es valido.",
    });
  }
  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        message: "El equipo no fue encontrado",
      });
    }

    computer.brand = req.body.brand || computer.brand;
    computer.model = req.body.model || computer.model;
    computer.serialNumber = req.body.serialNumber || computer.serialNumber;
    computer.annexed = req.body.annexed || computer.annexed;
    computer.ubication = req.body.ubication || computer.ubication;
    computer.status = req.body.status || computer.status;
    computer.type = req.body.type || computer.type;

    const updatedComputer = await computer.save();
    res.json(updatedComputer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del equipo no es valido.",
    });
  }
  if (
    !req.body.brand &&
    !req.body.model &&
    !req.body.serialNumber &&
    !req.body.annexed &&
    !req.body.ubication &&
    !req.body.status &&
    !req.body.type
  ) {
    res.status(400).json({
      message: "Al menos alguno de estos campos debe ser enviado.",
    });
  }

  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        message: "El equipo no fue encontrado",
      });
    }

    computer.brand = req.body.brand || computer.brand;
    computer.model = req.body.model || computer.model;
    computer.serialNumber = req.body.serialNumber || computer.serialNumber;
    computer.annexed = req.body.annexed || computer.annexed;
    computer.ubication = req.body.ubication || computer.ubication;
    computer.status = req.body.status || computer.status;
    computer.type = req.body.type || computer.type;

    const updatedComputer = await computer.save();
    res.json(updatedComputer);
  } catch (error) {
    req.status(400).json({
      message: error.message,
    });
  }
};

const deleteOne = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del equipo no es valido.",
    });
  }
  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        message: "El equipo no fue encontrado",
      });
    }
    await computer.deleteOne({
      _id: computer._id,
    });
    res.json({
      message: `El equipo ${computer.serialNumber} fue eliminado correctamente.`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  showAll,
  register,
  showOne,
  updatePut,
  updatePatch,
  deleteOne,
};