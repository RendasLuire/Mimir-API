import moment from "moment";
import Computer from "../models/computer.model.js";
import Movement from "../models/movement.model.js";
import User from "../models/user.model.js";

const showAll = async (req, res) => {
  try {
    const computers = await Computer.find();
    if (computers.length === 0) {
      return res.status(204).json({
        data: {
          message: "No hay equipos para mostrar.",
        },
      });
    }
    return res.status(200).json({
      data: {
        computers,
        message: "Lista de equipos registrados.",
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

const register = async (req, res) => {
  const { brand, model, serialNumber, type, userTI } = req.body;

  if (!brand || !model || !serialNumber || !type || !userTI) {
    return res.status(400).json({
      data: {
        message:
          "Los campos Marca, Modelo, Numero de Serie, usuario y tipo son obligatorios.",
      },
    });
  }

  const computer = new Computer({
    brand,
    model,
    serialNumber,
    details: "",
    hostname: "MV-" + serialNumber,
    status: "activo",
    annexed: "Sin asignar",
    ubication: "",
    type,
    ip: "",
    user: {
      id: "Sin asignar",
      name: "Sin asignar",
    },
    custom: false,
    bussinesUnit: "",
    departament: {
      id: "Sin asignar",
      name: "Sin asignar",
    },
    monitor: {
      id: "Sin asignar",
      serialNumber: "Sin asignar",
    },
    headphones: false,
    adaptVGA: false,
    mouse: false,
  });

  try {
    const computerAlreadyExist = await Computer.findOne({
      serialNumber: computer.serialNumber,
    });

    if (computerAlreadyExist) {
      return res.status(409).json({
        data: {
          message: `Esta ${computer.type} ya esta registrada.`,
        },
      });
    }

    const newComputer = await computer.save();

    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    const userData = await User.findById(userTI);
    const description =
      "Equipo " +
      newComputer.serialNumber +
      " registrado el " +
      date +
      " por el usuario: " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: newComputer._id,
      type: "Equipo",
      date: moment().unix(),
      description,
    });

    const newMovement = await movement.save();

    res.status(201).json({
      data: {
        computer: newComputer,
        movement: newMovement,
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

const showOne = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del equipo no es valido.",
      },
    });
  }

  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        data: {
          message: "El equipo no fue encontrado",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: {
        messaje: error.message,
      },
    });
  }

  return res.status(200).json({
    data: {
      computer,
      message: "Informacion del equipo.",
    },
  });
};

const updatePut = async (req, res) => {
  const {
    brand,
    model,
    serialNumber,
    details,
    hostname,
    status,
    annexed,
    ubication,
    type,
    ip,
    custom,
    bussinesUnit,
    headphones,
    adaptVGA,
    mouse,
    user,
    userTI,
  } = req.body;

  console.log("Recibo: " + custom);

  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del equipo no es valido.",
      },
    });
  }
  try {
    let computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        data: {
          message: "El equipo no fue encontrado",
        },
      });
    }

    computer.hostname = hostname || computer.hostname;
    computer.brand = brand || computer.brand;
    computer.model = model || computer.model;
    computer.serialNumber = serialNumber || computer.serialNumber;
    computer.details = details || computer.details;
    computer.annexed = annexed || computer.annexed;
    computer.ubication = ubication || computer.ubication;
    computer.status = status || computer.status;
    computer.type = type || computer.type;
    computer.ip = ip || computer.ip;
    computer.bussinesUnit = bussinesUnit || computer.bussinesUnit;
    computer.user = user || computer.user;

    if (typeof custom !== "undefined" && custom !== null) {
      computer.custom = custom;
    }
    if (typeof headphones !== "undefined" && headphones !== null) {
      computer.headphones = headphones;
    }
    if (typeof adaptVGA !== "undefined" && adaptVGA !== null) {
      computer.adaptVGA = adaptVGA;
    }
    if (typeof mouse !== "undefined" && mouse !== null) {
      computer.mouse = mouse;
    }

    console.log("voy a guardar:" + computer.custom);

    const updatedComputer = await computer.save();

    const date = moment().format("DD/MM/YYYY HH:mm:ss");

    const userData = await User.findById(userTI);

    const description =
      "Equipo: " +
      updatedComputer.serialNumber +
      " actualizado el " +
      date +
      " por el usuario: " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: updatedComputer._id,
      type: "Equipo",
      description,
    });

    const newMovement = await movement.save();

    res.status(200).json({
      data: {
        computer: updatedComputer,
        movement: newMovement,
      },
    });
  } catch (error) {
    res.status(400).json({
      data: {
        message: error.message,
      },
    });
  }
};

const updatePatch = async (req, res) => {
  let computer;
  const { id } = req.params;
  const { userTI } = req.body;

  console.log(req.body);

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del equipo no es valido.",
      },
    });
  }
  if (
    !req.body.brand &&
    !req.body.model &&
    !req.body.serialNumber &&
    !req.body.details &&
    !req.body.status &&
    !req.body.annexed &&
    !req.body.ubication &&
    !req.body.type &&
    !req.body.ip &&
    !req.body.user &&
    !req.body.custom &&
    !req.body.bussinesUnit &&
    !req.body.departament &&
    !req.body.monitor &&
    !req.body.headphones &&
    !req.body.adaptVGA &&
    !req.body.mouse &&
    !req.body.hostname
  ) {
    res.status(400).json({
      data: {
        message: "Al menos alguno de estos campos debe ser enviado.",
      },
    });
  }

  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        data: {
          message: "El equipo no fue encontrado",
        },
      });
    }

    computer.hostname = req.body.hostname || computer.hostname;
    computer.user = req.body.user || computer.user;
    computer.brand = req.body.brand || computer.brand;
    computer.model = req.body.model || computer.model;
    computer.serialNumber = req.body.serialNumber || computer.serialNumber;
    computer.details = req.body.details || computer.details;
    computer.annexed = req.body.annexed || computer.annexed;
    computer.ubication = req.body.ubication || computer.ubication;
    computer.status = req.body.status || computer.status;
    computer.type = req.body.type || computer.type;
    computer.ip = req.body.ip || computer.ip;
    computer.custom = req.body.custom || computer.custom;
    computer.bussinesUnit = req.body.bussinesUnit || computer.bussinesUnit;
    computer.headphones = req.body.headphones || computer.headphones;
    computer.adaptVGA = req.body.adaptVGA || computer.adaptVGA;
    computer.mouse = req.body.mouse || computer.mouse;

    console.log(computer);

    const updatedComputer = await computer.save();

    const date = moment().format("DD/MM/YYYY HH:mm:ss");

    const userData = await User.findById(userTI);

    const description =
      "Equipo: " +
      updatedComputer.serialNumber +
      " actualizado el " +
      date +
      " por el usuario: " +
      userData.name +
      " .";

    const movement = new Movement({
      userTI,
      computer: updatedComputer._id,
      type: "Equipo",
      date: moment().unix(),
      description,
    });

    const newMovement = await movement.save();

    res.status(200).json({
      data: {
        computer: updatedComputer,
        movement: newMovement,
      },
    });
  } catch (error) {
    return res.status(400).json({
      data: {
        message: error.message,
      },
    });
  }
};

const deleteOne = async (req, res) => {
  let computer;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {
        message: "El ID del equipo no es valido.",
      },
    });
  }
  try {
    computer = await Computer.findById(id);
    if (!computer) {
      return res.status(404).json({
        data: {
          message: "El equipo no fue encontrado",
        },
      });
    }
    await computer.deleteOne({
      _id: computer._id,
    });
    res.status(200).json({
      data: {
        message: `El equipo ${computer.serialNumber} fue eliminado correctamente.`,
      },
    });
  } catch (error) {
    res.status(500).json({
      data: {
        message: error.message,
      },
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
