import { Router } from "express";
import token from "../middlewares/auth.js";
import storageController from "../controllers/storage.controller.js";

const router = Router();

router.get("/", token.auth, storageController.showAll);

router.post("/addcomplex", token.auth, storageController.addComplex);

router.post(
  "/addbuilding/:complexId",
  token.auth,
  storageController.addBuilding
);

router.post(
  "/addubication/:complexId/:buildingId",
  token.auth,
  storageController.addUbication
);

export default router;
