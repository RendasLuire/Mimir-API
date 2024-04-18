import mongoose from "mongoose";

const computerSchema = new mongoose.Schema({
  brand: String,
  model: String,
  serialNumber: String,
  details: String,
  hostname: String,
  status: String,
  annexed: String,
  ubication: String,
  type: String,
  ip: String,
  user: {
    id: String,
    name: String,
  },
  custom: Boolean,
  bussinesUnit: String,
  departament: {
    id: String,
    name: String,
  },
  monitor: {
    id: String,
    serialNumber: String,
  },
  headphones: Boolean,
  adaptVGA: Boolean,
  mouse: Boolean,
});

export default mongoose.model("Computer", computerSchema);
