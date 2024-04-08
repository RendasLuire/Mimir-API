import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: String,
  department: String,
  position: String,
  manager: String,
});

export default mongoose.model("person", personSchema);
