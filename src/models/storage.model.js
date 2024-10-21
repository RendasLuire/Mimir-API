import mongoose from "mongoose";

const storageSchema = new mongoose.Schema({
  complex: [
    {
      building: [
        {
          ubication: {
            type: String,
            required: [true, "ubication is required."],
          },
          level: {
            type: String,
            default: "PB",
          },
        },
      ],
    },
  ],
});

export default mongoose.model("Storage", storageSchema);
