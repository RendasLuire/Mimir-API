import moment from "moment";
import User from "../models/user.model.js";
import Movement from "../models/movement.model.js";

moment.locale("es-mx");

const registerMovement = async (
  userTI,
  object,
  name,
  id,
  typeMovement,
  objectOld,
  objectNew
) => {
  const userData = await User.findById(userTI);

  let description = "";

  if (typeMovement === "registrado") {
    description =
      `${object} ${name} fue registrado el ${moment().format(
        "LLL"
      )} por el usuario: ` + `${userData.name}.`;
  } else {
    const changes = [];
    for (const key in objectNew) {
      if (objectOld[key] !== objectNew[key]) {
        changes.push(`${key}: ${objectOld[key]} -> ${objectNew[key]}`);
      }
    }
    description =
      `${object} ${name} ${typeMovement} el ${moment().format(
        "LLL"
      )} por el usuario: ` + `${userData.name}. Cambios: ${changes.join(", ")}`;
  }

  const movement = new Movement({
    userTI,
    device: id,
    type: object,
    description,
    objectOld: typeMovement !== "registrado" ? objectOld : {},
    objectNew: typeMovement !== "registrado" ? objectNew : {},
  });

  await movement.save();
};

export default registerMovement;
