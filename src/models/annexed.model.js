import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const annexedSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, "Number is required"],
    unique: true,
    set: (value) => value?.toLowerCase() ?? "",
  },
  startDate: {
    type: Date,
    default: moment,
  },
  endDate: {
    type: Date,
    default: () => moment().add(3, "years"),
  },
  devices: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
      serialNumber: {
        type: String,
        required: [true, "Serial number is required"],
        set: (value) => value?.toLowerCase() ?? "",
      },
      typeDevice: {
        type: String,
        required: [true, "Type of device is required"],
        set: (value) => value?.toLowerCase() ?? "",
      },
    },
  ],
  bill: {
    type: String,
    default: "",
    set: (value) => value?.toLowerCase() ?? "",
  },
});

annexedSchema.pre("save", function (next) {
  if (this.number) {
    this.number = this.number.toLowerCase();
  }
  if (this.bill !== undefined) {
    this.bill = this.bill.toLowerCase();
  }

  if (this.devices && this.devices.length > 0) {
    this.devices.forEach((device) => {
      if (device.serialNumber) {
        device.serialNumber = device.serialNumber.toLowerCase();
      }
      if (device.typeDevice) {
        device.typeDevice = device.typeDevice.toLowerCase();
      }
    });
  }

  next();
});

export default mongoose.model("Annexed", annexedSchema);
