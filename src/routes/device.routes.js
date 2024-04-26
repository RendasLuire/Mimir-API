import { Router } from "express";
import token from "../middlewares/auth.js";
import deviceController from "../controllers/device.controller.js";

const router = Router();

router.get("/", token.auth, deviceController.showAll);

router.post("/", token.auth, deviceController.register);

router.get("/:id", token.auth, deviceController.showOne);

router.patch("/:id", token.auth, deviceController.updatePatch);

router.patch("/assing/:id", token.auth, deviceController.assing);

router.patch("/unassing/:id", token.auth, deviceController.unassing);

export default router;
