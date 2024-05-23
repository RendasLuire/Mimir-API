import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  brand: {
    type: String,
    require: true,
  },
  model: {
    type: String,
    require: true,
  },
  serialNumber: {
    type: String,
    require: true,
  },
  hostname: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "available",
  },
  annexed: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annexed",
    },
    number: {
      type: String,
      default: "unassigned",
    },
  },
  ubication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storage",
  },
  typeDevice: {
    type: String,
    require: true,
  },
  ip: {
    type: String,
    default: "",
  },
  mac: {
    type: String,
    default: "",
  },
  person: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    name: {
      type: String,
      default: "unassigned",
    },
  },
  custom: {
    type: Boolean,
    default: false,
  },
  bussinesUnit: {
    type: String,
    default: "unassigned",
  },
  departament: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    name: {
      type: String,
      default: "unassigned",
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

export default mongoose.model("Device", deviceSchema);
