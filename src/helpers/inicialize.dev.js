import Annexed from "../models/annexed.model.js";
import Movement from "../models/movement.model.js";
import Person from "../models/person.model.js";
import Device from "../models/device.model.js";
import User from "../models/user.model.js";
import Setting from "../models/setting.model.js";
import bcrypt from "bcrypt";
import deviceMock from "../mocks/devices.js";
import annexedMock from "../mocks/annexeds.js";
import personMock from "../mocks/persons.js";
import settingMock from "../mocks/settings.js";

const clearDataBase = async () => {
  try {
    await User.deleteMany();
    await Device.deleteMany();
    await Annexed.deleteMany();
    await Movement.deleteMany();
    await Person.deleteMany();
    await Setting.deleteMany();
  } catch (error) {
    console.log("Error al limpiar el entorno: ", error);
  }
};

const createUserAdmin = async () => {
  try {
    const user = new User({
      _id: "664f9386bc497ea1293420ca",
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
    console.log("Error al crear usuario admin: ", error);
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
    for (const item of settingMock) {
      const newSetting = new Setting(item);
      await newSetting.save();
    }
  } catch (error) {
    console.log("Error al cargar la informacion: ", error);
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

export const inicializeDataBaseProd = async () => {
  try {
    const countUsers = await User.countDocuments();

    console.log(countUsers);

    if (countUsers < 1) {
      await createUserAdmin();
      for (const item of settingMock) {
        const newSetting = new Setting(item);
        await newSetting.save();
      }
    }
  } catch (error) {
    console.log("Error al inicializar el entorno: ", error);
  }
};

export default { inicializeDataBaseDev, inicializeDataBaseTest };
