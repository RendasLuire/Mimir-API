import moment from "moment";
import Mongoose from "mongoose";

moment.locale("es-mx");

const movementSchema = new Mongoose.Schema({
  userTI: {
    type: String,
    require: true,
  },
  device: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: moment(),
  },
  description: String,
  objectOld: Object,
  objectNew: Object,
});

export default Mongoose.model("Movement", movementSchema);
