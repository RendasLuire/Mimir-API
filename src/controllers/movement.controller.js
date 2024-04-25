import moment from "moment";
import Movement from "../models/movement.model.js";

const showAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const movements = await Movement.find().skip(skip).limit(Number(limit));
    const movementsCount = await Movement.countDocuments();
    if (movements.length === 0) {
      return res.status(204).json({
        data: {},
        message: "No hay movimientos por mostrar.",
      });
    }

    const totalPages = Math.ceil(movementsCount / limit);
    return res.status(200).json({
      data: movements,
      pagination: {
        totalItems: movementsCount,
        totalPages,
        currentPage: Number(page),
      },
      message: "Lista de movimientos.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showAllFilter = async (req, res) => {
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
    const movements = await Movement.find({ device: id });
    if (movements.length === 0) {
      return res.status(204).json({
        data: {},
        message: "No hay movimientos por mostrar.",
      });
    }
    return res.status(200).json({
      data: movements,
      message: "Lista de los movimientos.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { userTI, computer, type, description } = req.body;

  if (!userTI || !computer || !type || !description) {
    return res.status(400).json({
      data: {
        message: "Los campos de usuario, equipo, tipo, fecha y descripcion",
      },
    });
  }

  const movement = new Movement({
    userTI,
    computer,
    type,
    description,
  });

  try {
    const newMovement = await movement.save();
    res.status(201).json({
      data: {
        newMovement,
        message: "Movimiento registrado.",
      },
    });
  } catch (error) {
    return res.status(500).json({
      data: {
        message: error.message,
      },
    });
  }
};

export default {
  showAll,
  showAllFilter,
  register,
};
