import moment from "moment";
import Movement from "../models/movement.model.js";

const showAll = async (req, res) => {
  try {
    const movements = await Movement.find();
    if (movements.length === 0) {
      return res.status(204).json([]);
    }
    return res.json(movements);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const showAllFilter = async (req, res) => {
  const { id } = req.params;
  try {
    const movements = await Movement.find({ computer: id });
    if (movements.length === 0) {
      return res.status(204).json([]);
    }
    return res.json(movements);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { userTI, computer, type, description } = req.body;
  const date = moment().unix();

  if (!userTI || !computer || !type || !description) {
    return res.status(400).json({
      message: "Los campos de usuario, equipo, tipo, fecha y descripcion",
    });
  }

  const movement = new Movement({
    userTI,
    computer,
    type,
    date,
    description,
  });

  try {
    const newMovement = await movement.save();
    res.status(201).json(newMovement);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {};

const updatePut = async (req, res) => {};

const updatePatch = async (req, res) => {};

const deleteOne = async (req, res) => {};

export default {
  showAll,
  showAllFilter,
  register,
  showOne,
  updatePut,
  updatePatch,
  deleteOne,
};
