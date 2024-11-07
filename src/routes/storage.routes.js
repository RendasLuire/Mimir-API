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

router.get("/:id", token.auth, storageController.showOne);

router.post("/ubication/", token.auth, storageController.searchByComplete);

router.post("/adddata/", token.auth, storageController.chargeData);

export default router;
