import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    set: (value) => value?.toLowerCase() ?? "",
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
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
});

personSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toLowerCase();
  }
  if (this.manager.name) {
    this.manager.name = this.manager.name.toLowerCase();
  }

  next();
});

export default mongoose.model("Person", personSchema);
