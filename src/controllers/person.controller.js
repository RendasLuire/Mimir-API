import Person from "../models/person.model.js";
import User from "../models/user.model.js";
import Device from "../models/device.model.js";
import registerMovement from "../helpers/movement.helper.js";

const showAll = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let persons;
    let personsCount;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { department: searchRegex },
        { position: searchRegex },
        { "manager.id": searchRegex },
        { "manager.name": searchRegex },
      ];
    }

    persons = await Person.find(query).skip(skip).limit(Number(limit));
    personsCount = await Person.countDocuments(query);

    if (persons.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay personas registradas.",
      });
    }

    const totalPages = Math.ceil(personsCount / limit);

    return res.status(200).json({
      data: persons,
      pagination: {
        totalItems: personsCount,
        totalPages,
        currentPage: Number(page),
      },
      message: "Lista de personas registradas.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { name, department, position, userTI } = req.body;

  if (!name || !department || !position || !userTI) {
    return res.status(400).json({
      data: {},
      message:
        "Los campos Nombre, Departamento, Posicion y usuario son obligatorios.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del usuario no es valido.",
    });
  }

  const person = new Person({
    name,
    department,
    position,
    manager: {
      id: "Sin asignar",
      name: "Sin asignar",
    },
  });

  try {
    const personAlreadyExist = await Person.findOne({
      name: person.name,
    });

    if (personAlreadyExist) {
      return res.status(409).json({
        data: {},
        message: "Esta persona ya esta registrada.",
      });
    }

    const newPerson = await person.save();

    await registerMovement(
      userTI,
      "Usuario",
      newPerson.name,
      newPerson._id,
      "registrado",
      null,
      newPerson
    );

    res.status(201).json({
      data: newPerson,
      message: "Informacion de la persona y movimiento.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let person;
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
      message: "El ID de la persona no es valido.",
    });
  }

  try {
    person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        data: {},
        message: "La persona no fue encontrada",
      });
    }

    return res.status(200).json({
      data: person,
      message: "Informacion de la persona.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showAllDevicesAssigment = async (req, res) => {
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
      message: "El ID de la persona no es valido.",
    });
  }

  try {
    const devices = await Device.find({
      "user.id": id,
    });

    console.log(devices);

    if (devices.length === 0) {
      return res.status(204).json({
        data: {},
        message: "No hay equipos asignados.",
      });
    }

    return res.status(200).json({
      data: devices,
      message: "Lista de equipos asignados.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  let person;
  const { id } = req.params;
  const { userTI } = req.body;

  if (!id || !userTI) {
    return res.status(404).json({
      data: {},
      message: "El ID del equipo no es valido.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID de la persona no es valido.",
    });
  }

  if (
    !req.body.name &&
    !req.body.position &&
    !req.body.department &&
    !req.body.manager
  ) {
    return res.status(400).json({
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

    person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        data: {},
        message: "La persona no fue encontrada",
      });
    }

    person.name = req.body.name || person.name;
    person.position = req.body.position || person.position;
    person.department = req.body.department || person.department;
    person.manager = req.body.manager || person.manager;

    const updatedPerson = await person.save();

    if (!updatedPerson) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      userTI,
      "Usuario",
      updatedPerson.serialNumber,
      updatedPerson._id,
      "actualizada",
      person,
      updatedPerson
    );

    res.status(200).json({
      data: updatedPerson,
      message: "Persona actualizada con exito.",
    });
  } catch (error) {
    res.status(400).json({
      data: {},
      message: error.message,
    });
  }
};

const assing = async (req, res) => {
  const { manager, userTI } = req.body;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del dispositivo no es valido.",
      },
    });
  }

  if (!id || !manager || !userTI) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }

  if (id == manager) {
    res.status(400).json({
      data: {
        message: "No se puede asignar a si mismo.",
      },
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

    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        data: {},
        message: "La persona no fue encontrado",
      });
    }

    const managerData = await Person.findById(manager);

    if (!managerData) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }
    const managerInfo = {
      id: managerData._id,
      name: managerData.name,
    };

    person.manager = managerInfo;

    const updatedPerson = await person.save();

    if (!updatedPerson) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      userTI,
      "persona",
      updatedPerson.name,
      updatedPerson._id,
      "asignada",
      person,
      updatedPerson
    );

    res.status(200).json({
      data: updatedPerson,
      message: "Persona asignado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const unassing = async (req, res) => {
  const { userTI } = req.body;
  const { id } = req.params;

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

  try {
    const internUser = await User.findById(userTI);

    if (!internUser) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        data: {},
        message: "La persona no fue encontrado",
      });
    }

    const manager = {
      id: "Sin asignar",
      name: "Sin asignar",
    };

    person.manager = manager;

    const updatedPerson = await person.save();
    if (!updatedPerson) {
      return res.status(400).json({
        data: {},
        message: "El dispositivo no fue actualizado.",
      });
    }

    await registerMovement(
      userTI,
      "persona",
      updatedPerson.name,
      updatedPerson._id,
      "asignada",
      person,
      updatedPerson
    );

    res.status(200).json({
      data: updatedPerson,
      message: "Persona liberado.",
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
  showAllDevicesAssigment,
  updatePatch,
  assing,
  unassing,
};
