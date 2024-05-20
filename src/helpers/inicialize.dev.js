import Annexed from "../models/annexed.model.js";
import Movement from "../models/movement.model.js";
import Person from "../models/person.model.js";
import Device from "../models/device.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import deviceMock from "../mocks/devices.js";
import annexedMock from "../mocks/annexeds.js";
import personMock from "../mocks/persons.js";

const clearDataBase = async () => {
  try {
    await User.deleteMany();
    await Device.deleteMany();
    await Annexed.deleteMany();
    await Movement.deleteMany();
    await Person.deleteMany();
  } catch (error) {
    console.log("Error al limpiar el entorno: ", error);
  }
};

const createUserAdmin = async () => {
  try {
    const user = new User({
      _id: "66427240408251f1eeecf939",
      name: "Admin",
      nickname: "admin",
      type: "admin",
      password: "admin",
      email: "admin@admin.com.mx",
    });

    let pwd = await bcrypt.hash(user.password, 10);
    user.password = pwd;

    await user.save();
  } catch (error) {
    console.log("Error al limpiar el entorno: ", error);
  }
};

const chargeDemoData = async () => {
  try {
    for (const item of deviceMock) {
      const newDevice = new Device(item);
      await newDevice.save();
    }
    for (const item of annexedMock) {
      const newAnnexed = new Annexed(item);
      await newAnnexed.save();
    }
    for (const item of personMock) {
      const newPerson = new Person(item);
      await newPerson.save();
    }
  } catch (error) {
    console.log("Error al limpiar el entorno: ", error);
  }
};

export const inicializeDataBaseDev = async () => {
  try {
    await clearDataBase();

    await createUserAdmin();

    await chargeDemoData();
  } catch (error) {
    console.log("Error al inicializar el entorno: ", error);
  }
};

export const inicializeDataBaseTest = async () => {
  try {
    await clearDataBase();

    await createUserAdmin();

    await chargeDemoData();
  } catch (error) {
    console.log("Error al inicializar el entorno: ", error);
  }
};

export default { inicializeDataBaseDev, inicializeDataBaseTest };
