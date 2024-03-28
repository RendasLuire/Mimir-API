import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: String,
        nickname: String,
        type: String,
        password: String,
        email: String
    }
)

export default mongoose.model('User', userSchema)