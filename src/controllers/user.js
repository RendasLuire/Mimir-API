import User from "../models/user.model.js";
import jwt from "../services/jwt.js";
import bcrypt from "bcrypt";

const showAll = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(204).json([]);
    }
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({
      message: "Los campos de nick y contraseña son obligatorios.",
    });
  }

  try {
    const user = await User.findOne({ nickname: nickname });

    if (!user) {
      return res.status(400).json({
        message: "El usuario no existe.",
      });
    }

    const pwd = bcrypt.compareSync(password, user.password);

    if (!pwd) {
      return res.status(400).json({
        message: "La contraseña es incorrecta.",
      });
    }

    const token = jwt.createToken(user);

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
      },
      token,
      message: "Login correcto.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { name, nickname, type, password, email } = req.body;

  if (!name || !nickname || !type || !password || !email) {
    return res.status(400).json({
      message:
        "Los campos de usuario, nick, tipo, contraseña y correo son obligatorios.",
    });
  }

  const user = new User({
    name,
    nickname,
    type,
    password,
    email,
  });

  try {
    const userAlreadyExists = await User.findOne({
      $or: [{ nickname: user.nickname }, { email: user.email }],
    });

    if (userAlreadyExists) {
      return res.status(409).json({
        message: "El usuario ya existe.",
      });
    }

    let pwd = await bcrypt.hash(user.password, 10);
    user.password = pwd;

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    message: error.message;
  }
};

const showOne = async (req, res) => {
  let user;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del usuario no es valido",
    });
  }

  try {
    user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  return res.json(user);
};

const updatePut = async (req, res) => {
  let user;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del usuario no es valido",
    });
  }

  try {
    user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
      });
    }

    user.name = req.body.name || user.name;
    user.nickname = req.body.nickname || user.nickname;
    user.type = req.body.type || user.type;
    user.password = req.body.password || user.password;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  let user;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del usuario no es valido",
    });
  }

  if (
    !req.body.name &&
    !req.body.nickname &&
    !req.body.type &&
    !req.body.password &&
    !req.body.email
  ) {
    res.status(400).json({
      message: "Al menos alguno de estos campos debe ser enviado",
    });
  }

  try {
    user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
      });
    }

    user.name = req.body.name || user.name;
    user.nickname = req.body.nickname || user.nickname;
    user.type = req.body.type || user.type;
    user.password = req.body.password || user.password;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteOne = async (req, res) => {
  let user;
  const { id } = req.params;
  try {
    user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "El usuario no fue encontrado",
      });
    }
    await user.deleteOne({
      _id: user._id,
    });
    res.json({
      message: `El usuario ${user.name} fue eliminado correctamente.`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  showAll,
  login,
  register,
  showOne,
  updatePut,
  updatePatch,
  deleteOne,
};
