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
    const isDuplicated = await Storage.find({ complex });

    if (isDuplicated !== null) {
      return res.status(202).json({
        data: isDuplicated,
        message: "Este complejo esta duplicado.",
      });
    }

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
    const isDuplicated = await Storage.find({
      "buildings.name": buildingName,
    }).populate("buildings");

    if (isDuplicated !== null) {
      return res.status(202).json({
        data: isDuplicated,
        message: "Este edificio esta duplicado.",
      });
    }

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
    const isDuplicated = await Storage.find({
      "buildings.ubications.ubication": ubication,
    }).populate("buildings.ubications");

    if (isDuplicated !== null) {
      return res.status(202).json({
        data: isDuplicated,
        message: "Esta ubicacion esta duplicado.",
      });
    }

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

    complete = building.name + " - " + ubication + " " + level;
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

const searchByComplete = async (req, res) => {
  const { complete } = req.body;

  if (!complete) {
    return res.status(404).json({
      data: {},
      message: "Es necesario agregar la ubicacion completa",
    });
  }

  try {
    const result = await Storage.findOne({
      "buildings.ubications.complete": complete,
    }).populate("buildings.ubications");

    return res.status(200).json({
      data: result,
      message: "All good.",
    });
  } catch (error) {
    return res.status(500).json({
      data: error,
      message: error.message,
    });
  }
};

const chargeData = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(404).json({
      data: {},
      message: "Es necesario enviar informacion.",
    });
  }

  try {
    const rows = data.split(";");
    let buildingReg = 0;
    let complexReg = 0;
    let ubicationReg = 0;

    for (const row of rows) {
      const trimmedRow = row.trim();
      if (!trimmedRow) continue;

      const item = trimmedRow.split(",");
      if (item.length !== 4) {
        return res.status(400).json({
          data: {},
          message: `Formato de fila inválido: ${trimmedRow}. Cada fila debe tener exactamente cuatro elementos separados por comas.`,
        });
      }

      const complexName = item[0].trim();
      const buildingName = item[1].trim();
      const ubicationName = item[2].trim();
      const level = item[3].trim();
      const complete = `${buildingName} - ${ubicationName} ${level}`;

      let complexObj = await Storage.findOne({ complex: complexName });
      if (!complexObj) {
        complexObj = new Storage({ complex: complexName, buildings: [] });
        await complexObj.save();
        complexReg++;
      }

      let buildingObj = complexObj.buildings.find(
        (b) => b.name === buildingName
      );
      if (!buildingObj) {
        buildingObj = { name: buildingName, ubications: [] };
        complexObj.buildings.push(buildingObj);
        await complexObj.save();
        buildingReg++;
      }

      let buildingIndex = complexObj.buildings.findIndex(
        (b) => b.name === buildingName
      );
      if (buildingIndex === -1) {
        return res.status(500).json({
          data: {},
          message: "Error interno del servidor.",
        });
      }

      let ubicationObj = buildingObj.ubications.find(
        (u) => u.ubication === ubicationName
      );

      if (!ubicationObj) {
        complexObj.buildings[buildingIndex].ubications.push({
          ubication: ubicationName,
          level,
          complete,
        });
        complexObj.markModified("buildings");
        await complexObj.save();
        ubicationReg++;
      }
    }

    return res.status(201).json({
      data: {
        complexReg,
        buildingReg,
        ubicationReg,
      },
      message: "Datos registrados",
    });
  } catch (error) {
    return res.status(500).json({
      data: error,
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
  searchByComplete,
  chargeData,
};
