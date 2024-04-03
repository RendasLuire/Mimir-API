import mongoose from "mongoose";

const computerSchema = new mongoose.Schema({
  brand: String,
  model: String,
  serialNumber: String,
  annexed: String,
  ubication: String,
  status: String,
  type: String,
  user: String,
  hostname: String,
});

export default mongoose.model("Computer", computerSchema);
