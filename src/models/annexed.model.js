import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const annexedSchema = new mongoose.Schema({
  annexedNumber: {
    type: String,
    require: true,
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
      id: String,
      serialNumber: String,
      tax: Number,
      unitValue: Number,
      amount: Number,
    },
  ],
  bill: String,
});

export default mongoose.model("Annexed", annexedSchema);
