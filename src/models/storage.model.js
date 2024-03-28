import mongoose from "mongoose";

const storageSchema = new mongoose.Schema(
    {
        name: String,
        bussinessUnit: String,
        department: String
    }
)

export default mongoose.model('Storage', storageSchema)