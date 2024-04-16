import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: String,
  department: String,
  position: String,
  manager: {
    managerId: String,
    managerName: String,
  },
});

export default mongoose.model("person", personSchema);
