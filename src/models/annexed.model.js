import mongoose from 'mongoose'

const annexedSchema = new mongoose.Schema(
    {
        annexedNumber: String,
        startDate: Date,
        endDate: Date,
        bill: String
    }
)

export default mongoose.model('Annexed', annexedSchema)