import { Mongoose } from "mongoose";

const personSchema = new Mongoose.Schema(
    {
        name: String,
        department: String,
        position: String,
        manager: String,
        managerPosition: String
    }
)

export default Mongoose.model('person', personSchema)