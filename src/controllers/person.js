import moment from "moment";
import Person from "../models/person.model.js";
import Movement from "../models/movement.model.js";
import User from "../models/user.model.js";

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
    manager: "",
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
      date,
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

export default {
  showAll,
  register,
};
