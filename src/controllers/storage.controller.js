import Storage from "../models/storage.model.js";
import moment from "moment";

moment.locale("es-mx");

const showAll = async (req, res) => {
  try {
    const locations = await Storage.find();

    if (locations.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay localizaciones para mostrar.",
      });
    }

    return res.status(200).json({
      data: locations,
      message: "Lista de ubicaciones.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const addComplex = async (req, res) => {
  const { complex } = req.body;
  try {
    const newComplex = new Storage({ complex });
    await newComplex.save();

    return res.status(201).json({
      data: newComplex,
      message: "Complejo agregado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: req.body,
      message: error.message,
    });
  }
};

const deleteComplex = async (req, res) => {
  const { complexId } = req.params;
  try {
    const complex = await Storage.findByIdAndDelete(complexId);
    if (!complex) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    return res.status(200).json({
      data: complex,
      message: "Complejo eliminado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const addBuilding = async (req, res) => {
  const { complexId } = req.params;
  const { buildingName } = req.body;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    storage.buildings.push({ name: buildingName });
    await storage.save();

    return res.status(201).json({
      data: storage,
      message: "Edificio agregado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const deleteBuilding = async (req, res) => {
  const { complexId, buildingId } = req.params;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    const building = storage.buildings.id(buildingId);
    if (!building) {
      return res.status(404).json({
        data: {},
        message: "Edificio no encontrado.",
      });
    }

    building.remove();
    await storage.save();

    return res.status(200).json({
      data: storage,
      message: "Edificio eliminado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const addUbication = async (req, res) => {
  const { complexId, buildingId } = req.params;
  const { ubication, level } = req.body;

  let complete;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    const building = storage.buildings.id(buildingId);
    if (!building) {
      return res.status(404).json({
        data: {},
        message: "Edificio no encontrado.",
      });
    }

    complete =
      storage.name + " " + building.name + " - " + ubication + " " + level;
    building.ubications.push({ ubication, level, complete });
    await storage.save();

    return res.status(201).json({
      data: storage,
      message: "Ubicación agregada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const deleteUbication = async (req, res) => {
  const { complexId, buildingId, ubicationId } = req.params;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    const building = storage.buildings.id(buildingId);
    if (!building) {
      return res.status(404).json({
        data: {},
        message: "Edificio no encontrado.",
      });
    }

    const ubication = building.ubications.id(ubicationId);
    if (!ubication) {
      return res.status(404).json({
        data: {},
        message: "Ubicación no encontrada.",
      });
    }

    ubication.remove();
    await storage.save();

    return res.status(200).json({
      data: storage,
      message: "Ubicación eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  const { complexId } = req.params;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    return res.status(200).json({
      data: storage,
      message: "Detalles del complejo.",
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
  addComplex,
  deleteComplex,
  addBuilding,
  deleteBuilding,
  addUbication,
  deleteUbication,
  showOne,
};
