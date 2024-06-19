import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    set: (info) => info?.toLowerCase() ?? "",
  },
  options: [
    {
      label: {
        type: String,
        required: [true, "Label is required"],
        set: (value) => value?.toLowerCase() ?? "",
      },
      value: {
        type: String,
        required: [true, "Value is required"],
        set: (value) => value?.toLowerCase() ?? "",
      },
    },
  ],
});

settingSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toLowerCase();
  }

  if (this.options && this.options.length > 0) {
    this.options.forEach((option) => {
      if (option.label) {
        option.label = option.label.toLowerCase();
      }
      if (option.value) {
        option.value = option.value.toLowerCase();
      }
    });
  }

  next();
});

export default mongoose.model("Setting", settingSchema);
