import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  profile: {
    type: String,
    default: "Tecnico",
  },
  password: String,
  email: String,
});

export default mongoose.model("User", userSchema);
