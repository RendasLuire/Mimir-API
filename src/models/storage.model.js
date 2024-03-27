import { Mongoose } from "mongoose";

const storageSchema = new Mongoose.Schema(
    {
        name: String,
        bussinessUnit: String,
        department: String
    }
)

export default Mongoose.model('Storage', storageSchema)