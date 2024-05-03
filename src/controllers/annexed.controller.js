import registerMovement from "../helpers/movement.helper.js";
import Annexed from "../models/annexed.model.js";
import User from "../models/user.model.js";
import Device from "../models/device.model.js";

const showAll = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  try {
    let annexeds;
    let annexedCount;
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { annexedNumber: searchRegex },
        { startDate: searchRegex },
        { endDate: searchRegex },
        { "device.id": searchRegex },
        { "device.serialNumber": searchRegex },
        { bill: searchRegex },
      ];
    }

    annexeds = await Annexed.find(query).skip(skip).limit(Number(limit));
    annexedCount = await Annexed.countDocuments(query);

    if (annexeds.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay anexos registrados.",
      });
    }

    const totalPages = Math.ceil(annexedCount / limit);

    return res.status(200).json({
      data: annexeds,
      pagination: {
        totalItems: annexedCount,
        totalPages,
        currenPage: Number(page),
      },
      message: "Lista de anexos registrado.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const { annexedNumber, startDate, endDate, bill, userTI } = req.body;

  if (!annexedNumber || !userTI || !bill) {
    return res.status(400).json({
      data: {},
      message: "Los campos son obligatorios.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del usuario no es valido.",
    });
  }

  const annexed = new Annexed({
    annexedNumber,
    startDate,
    endDate,
    bill,
  });

  try {
    const userData = await User.findById(userTI);

    if (!userData) {
      return res.status(404).json({
        data: {},
        message: "El ID del usuario no es valido.",
      });
    }
    const newAnnexed = await annexed.save();

    if (!newAnnexed) {
      res.status(400).json({
        data: {},
        message: "Ocurrio algun problema al registrar el anexo.",
      });
    }

    await registerMovement(
      userTI,
      "annexo",
      newAnnexed.annexedNumber,
      newAnnexed._id,
      "registrado",
      null,
      newAnnexed
    );

    res.status(201).json({
      data: newAnnexed,
      message: "El anexo fue registrado con exito.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      message: error.message,
    });
  }
};

const showOne = async (req, res) => {
  let annexed;
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
      message: "El ID del dispositivo no es valido.",
    });
  }

  try {
    annexed = await Annexed.findById(id);
    if (!annexed) {
      return res.status(404).json({
        data: {},
        message: "",
      });
    }

    return res.status(200).json({
      data: annexed,
      message: "Informacion del anexo.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      messaje: error.message,
    });
  }
};

const showDevicesGrp = async (req, res) => {
  let annexed;
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
      message: "El ID del dispositivo no es valido.",
    });
  }

  try {
    annexed = await Annexed.findById(id);
    if (!annexed) {
      return res.status(404).json({
        data: {},
        message: "",
      });
    }

    const { devices } = annexed;

    if (devices.length === 0) {
      return res.status(204).json({
        data: [],
        message: "No hay dispositivos registrados.",
      });
    }

    const groupedDevices = devices.reduce((acc, device) => {
      if (!acc[device.typeDevice]) {
        acc[device.typeDevice] = {
          typeDevice: device.typeDevice,
          serialNumbers: [],
        };
      }
      acc[device.typeDevice].serialNumbers.push(device.serialNumber);
      return acc;
    }, {});

    const groupedDevicesArray = Object.values(groupedDevices);

    return res.status(200).json({
      data: groupedDevicesArray,
      message: "Informacion del anexo.",
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      messaje: error.message,
    });
  }
};

const masiveRegister = async (req, res) => {
  const {
    userTI,
    brand,
    model,
    description,
    type,
    serialNumber,
    unitValue,
    tax,
    amount,
    bill,
  } = req.body;
  const { id } = req.params;

  let annexed,
    user,
    createdDevices = [],
    existingDevices = [];

  if (
    !userTI ||
    !id ||
    !brand ||
    !model ||
    !description ||
    !type ||
    !serialNumber ||
    !unitValue ||
    !tax ||
    !amount ||
    !bill
  ) {
    res.status(400).json({
      data: {},
      message: "Los campos id, userTI son obligatorios.",
    });
  }

  if (
    typeof brand !== "string" ||
    typeof type !== "string" ||
    typeof description !== "string" ||
    typeof bill !== "string" ||
    typeof model !== "string" ||
    typeof amount !== "number" ||
    typeof tax !== "number" ||
    typeof unitValue !== "number"
  ) {
    res.status(400).json({
      data: {},
      message: "Los campos no tienen el formato correcto.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/) || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del anexo o el usuario no es valido no es valido.",
    });
  }

  if (!serialNumber || serialNumber.length === 0) {
    return res.status(400).json({
      data: {},
      message: "Se requiere al menos un número de serie.",
    });
  }

  const serialNumbersArray = serialNumber.split(", ");

  try {
    annexed = await Annexed.findById(id);
    user = await User.findById(userTI);

    if (!annexed || !user) {
      return res.status(404).json({
        data: {},
        message: "El anexo o el usuario no fue encontrado.",
      });
    }

    for (const sn of serialNumbersArray) {
      let deviceIndex = await Device.findOne({ serialNumber: sn });

      if (!deviceIndex) {
        const newDevice = new Device({
          brand,
          model,
          annexed: {
            id: annexed._id,
            number: annexed.annexedNumber,
          },
          description,
          type,
          serialNumber: sn,
        });
        const createdDevice = await newDevice.save();

        if (!createdDevice) {
          res.status(400).json({
            data: {},
            message: "No se registro el dispositivo.",
          });
        }

        await registerMovement(
          userTI,
          createdDevice.type,
          createdDevice.serialNumber,
          createdDevice._id,
          "registrado",
          null,
          createdDevice
        );

        const deviceInfo = {
          id: createdDevice._id,
          serialNumber: createdDevice.serialNumber,
          typeDevice: createdDevice.type,
          tax,
          unitValue,
          amount,
        };
        createdDevices.push(deviceInfo);
        existingDevices.push(deviceInfo);
      } else {
        const deviceOld = deviceIndex;
        deviceIndex.annexed.id = annexed._id;
        deviceIndex.annexed.number = annexed.annexedNumber;

        const updatedDevice = await deviceIndex.save();

        if (!updatedDevice) {
          res.status(400).json({
            data: {},
            message: "No se actualizo el dispositivo.",
          });
        }

        await registerMovement(
          userTI,
          updatedDevice.type,
          updatedDevice.serialNumber,
          updatedDevice._id,
          "actualizado",
          deviceOld,
          updatedDevice
        );

        const deviceInfo = {
          id: updatedDevice._id,
          serialNumber: updatedDevice.serialNumber,
          typeDevice: updatedDevice.type,
          tax,
          unitValue,
          amount,
        };
        existingDevices.push(deviceInfo);
      }

      deviceIndex = {};
    }

    const annexedOld = annexed;

    annexed.devices.push(
      ...existingDevices.map((d) => ({
        id: d._id,
        serialNumber: d.serialNumber,
        typeDevice: d.typeDevice,
        unitValue,
        tax,
        amount,
      }))
    );

    const updatedAnnexed = await annexed.save();

    if (!updatedAnnexed) {
      res.status(400).json({
        data: {},
        message: "No se actualizo el anexo.",
      });
    }

    await registerMovement(
      userTI,
      "Anexo",
      updatedAnnexed.annexedNumber,
      updatedAnnexed._id,
      "actualizado",
      annexedOld,
      updatedAnnexed
    );

    res.status(200).json({
      data: updatedAnnexed,
      message: `Se crearon ${createdDevices.length} y se agregaron ${existingDevices.length} dispositivos correctamente.`,
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      messaje: error.message,
    });
  }
};

const updatePatch = async (req, res) => {
  const { id } = req.params;
  const { annexedNumber, startDate, endDate, bill, userTI } = req.body;

  if (!id) {
    return res.status(400).json({
      data: {},
      message: "Es necesario el ID.",
    });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del dispositivo no es valido.",
    });
  }

  if (!annexedNumber || !startDate || !endDate || !bill) {
    return res.status(400).json({
      data: {},
      message: "Es necesario ingresar algun dato.",
    });
  }

  try {
    const user = await User.findById(userTI);
    if (!user) {
      return res.status(409).json({
        data: {},
        message: `Este usuario no existe.`,
      });
    }

    let annexed = await Annexed.findById(id);
    if (!annexed) {
      return res.status(404).json({
        data: {},
        message: "El anexo no fue encontrado",
      });
    }

    const annexedOld = annexed;

    if (annexedNumber) {
      annexed.annexedNumber = annexedNumber || annexed.annexedNumber;

      if (annexed.devices && annexed.devices.length > 0) {
        annexed.devices.forEach(async (device) => {
          try {
            const updatedDevice = await Device.findByIdAndUpdate(
              device._id,
              { $set: { "annexed.number": annexedNumber } },
              { new: true }
            );
            if (!updatedDevice) {
              console.log(
                `No se pudo actualizar el dispositivo con ID ${device._id}`
              );
            }
          } catch (error) {
            console.error(
              `Error al actualizar el dispositivo con ID ${device._id}: ${error}`
            );
          }
        });
      }
    }

    annexed.startDate = startDate || annexed.startDate;
    annexed.endDate = endDate || annexed.endDate;
    annexed.bill = bill || annexed.bill;

    const updatedAnnexed = await Annexed.save();

    if (!updatedAnnexed) {
      return res.status(400).json({
        data: {},
        message: "El anexo no fue actualizado.",
      });
    }

    await registerMovement(
      userTI,
      "anexo",
      updatedAnnexed.annexedNumber,
      updatedAnnexed._id,
      "actualizada",
      annexedOld,
      updatedAnnexed
    );

    res.status(200).json({
      data: updatedAnnexed,
      message: "Anexo actualizado.",
    });
  } catch (error) {}
};

export default {
  showAll,
  showOne,
  showDevicesGrp,
  register,
  masiveRegister,
  updatePatch,
};
