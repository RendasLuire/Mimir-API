import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    set: (info) => info.toLowerCase(),
  },
  options: [
    {
      label: {
        type: String,
        require: true,
      },
      value: {
        type: String,
        require: true,
      },
    },
  ],
});

settingSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();

  this.options.forEach((option) => {
    option.label = option.label.toLowerCase();
    option.value = option.value.toLowerCase();
  });

  next();
});

export default mongoose.model("Setting", settingSchema);
