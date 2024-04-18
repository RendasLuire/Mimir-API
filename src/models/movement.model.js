import Mongoose from "mongoose";

const movementSchema = new Mongoose.Schema({
  userTI: String,
  computer: String,
  type: String,
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

export default Mongoose.model("Movement", movementSchema);
