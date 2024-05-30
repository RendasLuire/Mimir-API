import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  brand: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  model: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  serialNumber: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  hostname: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  details: {
    type: String,
    default: "",
    set: (value) => value.toLowerCase(),
  },
  status: {
    type: String,
    default: "available",
    set: (value) => value.toLowerCase(),
  },
  annexed: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annexed",
    },
    number: {
      type: String,
      default: "unassigned",
      set: (value) => value.toLowerCase(),
    },
  },
  ubication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storage",
  },
  typeDevice: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  ip: {
    type: String,
    default: "",
    set: (value) => value.toLowerCase(),
  },
  mac: {
    type: String,
    default: "",
    set: (value) => value.toLowerCase(),
  },
  person: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    name: {
      type: String,
      default: "unassigned",
      set: (value) => value.toLowerCase(),
    },
  },
  custom: {
    type: Boolean,
    default: false,
  },
  bussinesUnit: {
    type: String,
    default: "unassigned",
    set: (value) => value.toLowerCase(),
  },
  departament: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    name: {
      type: String,
      default: "unassigned",
      set: (value) => value.toLowerCase(),
    },
  },
  monitor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    serialNumber: {
      type: String,
      default: "unassigned",
      set: (value) => value.toLowerCase(),
    },
  },
  headphones: {
    type: Boolean,
    default: false,
  },
  adaptVGA: {
    type: Boolean,
    default: false,
  },
  mouse: {
    type: Boolean,
    default: false,
  },
});

deviceSchema.pre("save", function (next) {
  this.brand = this.brand.toLowerCase();
  this.model = this.model.toLowerCase();
  this.serialNumber = this.serialNumber.toLowerCase();
  this.hostname = this.hostname.toLowerCase();
  this.details = this.details.toLowerCase();
  this.status = this.status.toLowerCase();
  this.annexed.number = this.annexed.number.toLowerCase();
  this.typeDevice = this.typeDevice.toLowerCase();
  this.ip = this.ip.toLowerCase();
  this.mac = this.mac.toLowerCase();
  this.person.name = this.person.name.toLowerCase();
  this.bussinesUnit = this.bussinesUnit.toLowerCase();
  this.departament.name = this.departament.name.toLowerCase();
  this.monitor.serialNumber = this.monitor.serialNumber.toLowerCase();

  next();
});

export default mongoose.model("Device", deviceSchema);
