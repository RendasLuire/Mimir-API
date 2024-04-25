import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

config();

import userRoutes from "./routes/user.routes.js";
import annexedRoutes from "./routes/annexed.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import movementRoutes from "./routes/movement.routes.js";
import personRoutes from "./routes/person.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;

app.use("/api/user", userRoutes);
app.use("/annexeds", annexedRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/persons", personRoutes);
app.use("/storages", storageRoutes);
app.use("/reports", pdfRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
