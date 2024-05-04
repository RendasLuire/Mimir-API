import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

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
    default: "Activo",
  },
  annexed: {
    id: {
      type: String,
      default: "Sin asignar",
    },
    number: {
      type: String,
      default: "Sin asignar",
    },
  },
  ubication: {
    type: String,
    default: "",
  },
  typeDevice: String,
  ip: {
    type: String,
    default: "",
  },
  user: {
    id: {
      type: String,
      default: "Sin asignar",
    },
    name: {
      type: String,
      default: "Sin asignar",
    },
  },
  custom: {
    type: Boolean,
    default: false,
  },
  bussinesUnit: {
    type: String,
    default: "",
  },
  departament: {
    id: {
      type: String,
      default: "Sin asignar",
    },
    name: {
      type: String,
      default: "Sin asignar",
    },
  },
  monitor: {
    id: {
      type: String,
      default: "Sin asignar",
    },
    serialNumber: {
      type: String,
      default: "Sin asignar",
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
