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
  let devicesCreated = [];
  let devicesUpdated = [];
  const {
    userTI,
    brand,
    model,
    description,
    typeDevice,
    serialNumber,
    unitValue,
    tax,
    amount,
  } = req.body;
  const { id } = req.params;

  if (
    !userTI ||
    !brand ||
    !model ||
    !description ||
    !typeDevice ||
    !serialNumber ||
    !unitValue ||
    !tax ||
    !amount ||
    !id
  ) {
    return res.status(401).json({
      data: {},
      message: "Los datos enviados no estan completos.",
    });
  }

  if (!userTI.match(/^[0-9a-fA-F]{24}$/) || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      data: {},
      message: "El ID del anexo o el usuario no es valido no es valido.",
    });
  }

  try {
    const userTIData = await User.findById(userTI);
    if (!userTIData) {
      return res.status(400).json({
        data: {},
        message: "El usuario de TI no existe.",
      });
    }

    const annexedData = await Annexed.findById(id);

    if (!annexedData) {
      return res.status(400).json({
        data: {},
        message: "El anexo no existe.",
      });
    }

    const serialNumbersArray = serialNumber.split(", ");

    console.log(!annexedData);

    for (const sn of serialNumbersArray) {
      const deviceExists = annexedData.devices.some(
        (device) => device.serialNumber === sn || device.id === sn
      );
      if (deviceExists) {
        continue;
      }

      const deviceData = await Device.findOne({ serialNumber: sn });

      if (!deviceData) {
        const deviceToSave = new Device({
          brand,
          model,
          description,
          typeDevice,
          serialNumber: sn,
          hostname: "MV-" + sn,
          annexed: {
            id: annexedData._id,
            number: annexedData.annexedNumber,
          },
        });

        const savedDevice = await deviceToSave.save();
        if (!savedDevice) {
          return res.status(400).json({
            data: deviceToSave,
            message: "Ocurrio un problema al guardar este equipo.",
          });
        }

        await registerMovement(
          userTIData._id,
          savedDevice.typeDevice,
          savedDevice.serialNumber,
          savedDevice._id,
          "registrado",
          null,
          savedDevice
        );

        const deviceDataFiltered = {
          id: savedDevice._id,
          serialNumber: savedDevice.serialNumber,
          typeDevice: savedDevice.typeDevice,
          tax,
          unitValue,
          amount,
        };

        devicesCreated.push(deviceDataFiltered);
      } else {
        const deviceDataOld = deviceData;

        deviceData.annexed.id = annexedData._id;
        deviceData.annexed.name = annexedData.annexedNumber;

        const savedDevice = await deviceData.save();
        if (!savedDevice) {
          return res.status(400).json({
            data: deviceData,
            message: "Ocurrio un problema al guardar este equipo.",
          });
        }

        await registerMovement(
          userTI,
          savedDevice.typeDevice,
          savedDevice.serialNumber,
          savedDevice._id,
          "actualizada",
          deviceDataOld,
          savedDevice
        );

        const deviceDataFiltered = {
          id: savedDevice._id,
          serialNumber: savedDevice.serialNumber,
          typeDevice: savedDevice.typeDevice,
          tax,
          unitValue,
          amount,
        };

        devicesUpdated.push(deviceDataFiltered);
      }
    }

    const annexedDataOld = annexedData;

    annexedData.devices.push(...devicesCreated, ...devicesUpdated);

    const annexedUpdated = await annexedData.save();

    if (!annexedUpdated) {
      return res.status(400).json({
        data: annexedData,
        message: "Ocurrio un problema al guardar este anexo.",
      });
    }

    await registerMovement(
      userTI,
      "anexo",
      annexedUpdated.annexedNumber,
      annexedUpdated._id,
      "actualizada",
      annexedDataOld,
      annexedUpdated
    );

    return res.status(200).json({
      data: annexedUpdated,
      message: `Se agregaron ${devicesCreated} y se actualizaron ${devicesUpdated}.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: {},
      message: error,
    });
  }
};

const updatePatch = async (req, res) => {
  const { id } = req.params;
  const { annexedNumber, startDate, endDate, bill, userTI } = req.body;

  if (!id || !userTI) {
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

  if (!annexedNumber && !startDate && !endDate && !bill) {
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
            const deviceObj = await Device.findById(device._id);
            deviceObj.annexed.number = annexedNumber;
            const updatedDevice = await deviceObj.save();
            /*const updatedDevice = await Device.findByIdAndUpdate(device._id, {
              "annexed.number": annexedNumber,
            });*/
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

    const updatedAnnexed = await annexed.save();

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
  } catch (error) {
    res.status(500).json({
      data: {},
      message: error,
    });
  }
};

export default {
  showAll,
  showOne,
  showDevicesGrp,
  register,
  masiveRegister,
  updatePatch,
};
