import  express  from 'express'
import { Mongoose } from 'mongoose'
import bodyParser from 'body-parser'
import { config } from 'dotenv'

config()

import userRoutes from './routes/user.routes'

const app = express();
app.use(bodyParser.json())

Mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection

app.use('/books', userRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`)
})