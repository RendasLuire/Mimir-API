import mongoose from "mongoose";

const storageSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  bussinessUnit: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Storage", storageSchema);
