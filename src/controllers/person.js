import moment from "moment";
import Person from "../models/person.model.js";
import Movement from "../models/movement.model.js";
import User from "../models/user.model.js";
import Computer from "../models/computer.model.js";

const showAll = async (req, res) => {
  try {
    const persons = await Person.find();
    if (persons.length === 0) {
      return res.status(204).json([]);
    }

    return res.status(200).json(persons);
  } catch (erro) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { name, department, position, userTI } = req.body;

  if (!name || !department || !position || !userTI) {
    return res.status(400).json({
      message:
        "Los campos Nombre, Departamento, Posicion y usuario son obligatorios.",
    });
  }

  const person = new Person({
    name,
    department,
    position,
    manager: {
      managerId: "unassigned",
      managerName: "unassigned",
    },
  });

  try {
    const personAlreadyExist = await Person.findOne({
      name: person.name,
    });

    if (personAlreadyExist) {
      return res.status(409).json({
        status: 409,
        message: "Esta persona ya esta registrada.",
      });
    }

    const newPerson = await person.save();
    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    const userData = await User.findById(userTI);
    const description =
      "Person " +
      newPerson.name +
      " registered on " +
      date +
      " by user " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: newPerson._id,
      type: "person",
      date: moment().unix(),
      description,
    });

    const newMovement = await movement.save();

    res.status(201).json({
      status: 201,
      person: newPerson,
      movement: newMovement,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let person;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID de la persona no es valido.",
    });
  }

  try {
    person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        message: "La persona no fue encontrada",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(200).json({
    person,
  });
};

const showAllFilter = async (req, res) => {
  const { id } = req.params;

  try {
    const computers = await Computer.find({
      userId: id,
    });

    if (computers.length === 0) {
      return res.status(204).json({
        data: {
          message: "No hay equipos asignados.",
        },
      });
    }

    return res.status(200).json({
      data: {
        computers,
        message: "Lista de equipos asignados.",
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

const updatePut = async (req, res) => {
  const { name, department, position, manager, userTI } = req.body;

  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del usuario no es valido.",
    });
  }
  try {
    let person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
      });
    }

    person.name = name || person.name;
    person.department = department || person.department;
    person.position = position || person.position;
    person.manager = manager || person.manager;

    const updatedPerson = await person.save();

    const date = moment().format("DD/MM/YYYY HH:mm:ss");

    const userData = await User.findById(userTI);

    const description =
      "Person updated " +
      updatedPerson.name +
      " on " +
      date +
      " by user: " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: updatedPerson._id,
      type: "person",
      date,
      description,
    });

    const newMovement = await movement.save();

    res.status(200).json({
      computer: updatedPerson,
      movement: newMovement,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  let person;
  const { id } = req.params;
  const { userTI } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
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
      message: "Al menos alguno de estos campos debe ser enviado.",
    });
  }

  try {
    person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        message: "La persona no fue encontrada",
      });
    }

    person.name = req.body.name || person.name;
    person.position = req.body.position || person.position;
    person.department = req.body.department || person.department;
    person.manager = req.body.manager || person.manager;

    const updatedPerson = await person.save();

    console.log(updatedPerson);

    const date = moment().format("DD/MM/YYYY HH:mm:ss");

    const userData = await User.findById(userTI);

    const description =
      "Person updated " +
      updatedPerson.name +
      " on " +
      date +
      " by user: " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: updatedPerson._id,
      type: "person",
      date: moment().unix(),
      description,
    });

    const newMovement = await movement.save();

    res.status(200).json({
      computer: updatedPerson,
      movement: newMovement,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export default {
  showAll,
  register,
  showOne,
  showAllFilter,
  updatePut,
  updatePatch,
};
