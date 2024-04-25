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

router.patch("/update/:id", token.auth, personController.updatePatch);

export default router;
