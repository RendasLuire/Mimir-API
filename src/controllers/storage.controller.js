import Storage from "../models/storage.model.js";
import moment from "moment.js";

moment.locale("es-mx");

const showAll = async (req, res) => {
  let locations;
  try {
    locations = await Storage.find();

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
      data: {},
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
  const { building } = req.body;
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complejo no encontrado.",
      });
    }

    storage.complex.push({ building });
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
        message: "Complex not found.",
      });
    }

    storage.complex.id(buildingId).remove();
    await storage.save();

    return res.status(200).json({
      data: storage,
      message: "Building deleted successfully.",
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
  try {
    const storage = await Storage.findById(complexId);
    if (!storage) {
      return res.status(404).json({
        data: {},
        message: "Complex not found.",
      });
    }

    const building = storage.complex.id(buildingId);
    if (!building) {
      return res.status(404).json({
        data: {},
        message: "Building not found.",
      });
    }

    building.building.push({ ubication, level });
    await storage.save();

    return res.status(201).json({
      data: storage,
      message: "Ubication added successfully.",
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
        message: "Complex not found.",
      });
    }

    const building = storage.complex.id(buildingId);
    if (!building) {
      return res.status(404).json({
        data: {},
        message: "Building not found.",
      });
    }

    building.building.id(ubicationId).remove();
    await storage.save();

    return res.status(200).json({
      data: storage,
      message: "Ubication deleted successfully.",
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
        message: "Complex not found.",
      });
    }

    return res.status(200).json({
      data: storage,
      message: "Complex details.",
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
