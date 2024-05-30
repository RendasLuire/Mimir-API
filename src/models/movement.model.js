import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const movementSchema = new mongoose.Schema({
  userTI: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Device",
  },
  type: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: moment(),
  },
  description: {
    type: String,
    require: true,
  },
  objectOld: Object,
  objectNew: Object,
});

export default mongoose.model("Movement", movementSchema);
