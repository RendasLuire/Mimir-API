import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const annexedSchema = new mongoose.Schema({
  number: {
    type: String,
    require: true,
    unique: true,
    set: (value) => value.toLowerCase(),
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
        set: (value) => value.toLowerCase(),
      },
      typeDevice: {
        type: String,
        require: true,
        set: (value) => value.toLowerCase(),
      },
    },
  ],
  bill: {
    type: String,
    default: "",
    set: (value) => value.toLowerCase(),
  },
});

annexedSchema.pre("save", function (next) {
  this.number = this.number.toLowerCase();
  this.bill = this.bill.toLowerCase();

  this.devices.forEach((device) => {
    device.serialNumber = device.serialNumber.toLowerCase();
    device.typeDevice = device.typeDevice.toLowerCase();
  });

  next();
});

export default mongoose.model("Annexed", annexedSchema);
