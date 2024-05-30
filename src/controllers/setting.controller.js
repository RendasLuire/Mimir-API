import Setting from "../models/setting.model.js";

const showAll = async (req, res) => {
  try {
    let settings;

    settings = await Setting.find();

    if (settings.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay settings registrados.",
      });
    }

    return res.status(200).json({
      data: settings,
      message: "Lista de Settings registrados.",
    });
  } catch (error) {
    return res.status(500).json({
      data: [],
      message: error.message,
    });
  }
};

const showOptions = async (req, res) => {
  const { name } = req.params;
  let setting;

  try {
    setting = await Setting.findOne({ name: name.toLowerCase() });

    if (!setting) {
      return res.status(404).json({
        data: {},
        message: "Setting no encontrado.",
      });
    }

    return res.status(200).json({
      data: setting.options,
      message: "Lista de opciones.",
    });
  } catch (error) {
    return res.status(500).json({
      data: [],
      message: error.message,
    });
  }
};

const addOption = async (req, res) => {
  const { name } = req.params;
  const { label, value } = req.body;
  let setting;

  if (!label || !value) {
    return res.status(400).json({
      data: {},
      message: "Los campos label y value son obligatorios.",
    });
  }

  try {
    setting = await Setting.findOne({ name: name.toLowerCase() });

    if (!setting) {
      return res.status(404).json({
        data: {},
        message: "Setting no encontrado",
      });
    }

    setting.options.push({ label, value });
    await setting.save();

    return res.status(200).json({
      data: setting,
      message: "Opcion agregada con exito.",
    });
  } catch (error) {
    return res.status(500).json({
      data: [],
      message: error.message,
    });
  }
};

const removeOption = async (req, res) => {
  const { name } = req.params;
  const { label } = req.body;
  let setting;

  if (!label) {
    return res.status(400).json({
      data: {},
      message: "El campo label es obligatorio.",
    });
  }

  try {
    setting = await Setting.findOne({ name: name.toLowerCase() });

    if (!setting) {
      return res.status(404).json({
        data: {},
        message: "Setting no encontrado.",
      });
    }

    setting.options = setting.options.filter(
      (option) => option.label !== label.toLowerCase()
    );

    await setting.save();

    return res.status(200).json({
      data: setting,
      message: "Opcion eliminada con exito.",
    });
  } catch (error) {
    return res.status(500).json({
      data: [],
      message: error.message,
    });
  }
};

export default {
  showAll,
  showOptions,
  addOption,
  removeOption,
};
