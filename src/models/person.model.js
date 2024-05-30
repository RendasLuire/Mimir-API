import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  department: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      require: true,
      set: (value) => value.toLowerCase(),
    },
  },
  position: {
    type: String,
    require: true,
    set: (value) => value.toLowerCase(),
  },
  manager: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      default: "unassigned",
      set: (value) => value.toLowerCase(),
    },
  },
});

personSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  this.department.name = this.department.name.toLowerCase();
  this.position = this.position.toLowerCase();
  this.manager.name = this.manager.name.toLowerCase();

  next();
});

export default mongoose.model("Person", personSchema);
