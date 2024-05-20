import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const annexedSchema = new mongoose.Schema({
  number: {
    type: String,
    require: true,
    unique: true,
  },
  startDate: {
    type: Date,
    default: moment(),
  },
  endDate: {
    type: Date,
    default: moment().add(3, "year"),
  },
  devices: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
      serialNumber: {
        type: String,
        require: true,
      },
      typeDevice: {
        type: String,
        require: true,
      },
    },
  ],
  bill: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Annexed", annexedSchema);
