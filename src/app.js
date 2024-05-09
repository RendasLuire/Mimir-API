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

let dataBase = process.env.MONGO_DB_NAME;
let port = process.env.PORT.trim() || 3000;

if (process.env.NODE_ENV.trim() == "development") {
  dataBase = process.env.MONGO_DB_NAME_DEV;
  port = process.env.PORT_DEV.trim();
}
if (process.env.NODE_ENV.trim() == "test") {
  dataBase = process.env.MONGO_DB_NAME_TEST;
  port = process.env.PORT_TEST.trim();
}

mongoose.connect(process.env.MONGO_URL, { dbName: dataBase });
const db = mongoose.connection;

app.use("/api/user", userRoutes);
app.use("/api/annexeds", annexedRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/persons", personRoutes);
app.use("/storages", storageRoutes);
app.use("/api/reports", pdfRoutes);

if (process.env.NODE_ENV.trim() == "development") {
  console.log("Cargando Informacion....");
}
if (process.env.NODE_ENV.trim() == "test") {
  console.log("Cargando Informacion....");
}

//Crear un usuario inicial

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
