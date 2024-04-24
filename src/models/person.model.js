import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  position: {
    type: String,
    require: true,
  },
  manager: {
    id: {
      type: String,
      default: "Sin asignar",
    },
    name: {
      type: String,
      default: "Sin asignar",
    },
  },
});

export default mongoose.model("person", personSchema);
