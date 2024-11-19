import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  department: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: [true, "Department name is required"],
    },
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  manager: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      default: "disponible",
    },
  },
  bussinesUnit: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      default: "",
    },
  },
});

export default mongoose.model("Person", personSchema);
