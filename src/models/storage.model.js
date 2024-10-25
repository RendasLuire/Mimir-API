import mongoose from "mongoose";

const ubicationSchema = new mongoose.Schema({
  ubication: {
    type: String,
    required: [true, "Ubication is required."],
    unique: [true, "This ubication already exists."],
  },
  level: {
    type: String,
    default: "PB",
  },
  complete: {
    type: String,
    required: [true, "Sentence complete is required."],
    unique: [true, "This complete sentence already exists."],
  },
});

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Building name is required."],
    unique: [true, "This building already exists."],
  },
  ubications: [ubicationSchema],
});

const complexSchema = new mongoose.Schema({
  complex: {
    type: String,
    required: [true, "Complex name is required."],
    unique: [true, "This complex already exists."],
  },
  buildings: [buildingSchema],
});

const Storage = mongoose.model("Storage", complexSchema);

export default Storage;
