import { Router } from "express";
import token from "../middlewares/auth.js";
import personController from "../controllers/person.controller.js";

const router = Router();

router.get("/", token.auth, personController.showAll);

router.post("/", token.auth, personController.register);

router.get("/:id", token.auth, personController.showOne);

router.get(
  "/assigned/:id",
  token.auth,
  personController.showAllDevicesAssigment
);

router.patch("/changeDevice", token.auth, personController.changeDevice);

router.patch("/:id", token.auth, personController.updatePatch);

router.patch("/assing/:id", token.auth, personController.assing);

router.patch("/unassing/:id", token.auth, personController.unassing);

export default router;
