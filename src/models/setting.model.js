import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  options: [
    {
      label: {
        type: String,
        required: [true, "Label is required"],
      },
      value: {
        type: String,
        required: [true, "Value is required"],
      },
      option: {
        type: String,
        default: "",
      },
    },
  ],
});

export default mongoose.model("Setting", settingSchema);
