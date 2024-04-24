import { Router } from "express";
import token from "../middlewares/auth.js";
import deviceController from "../controllers/device.controller.js";

const router = Router();

router.get("/", token.auth, deviceController.showAll);

router.post("/", token.auth, deviceController.register);

router.get("/:id", token.auth, deviceController.showOne);

router.get("/filter/:type", token.auth, deviceController.showOnlyType);

router.put("/update/:id", token.auth, deviceController.updatePut);

router.patch("/update/:id", token.auth, deviceController.updatePatch);

export default router;
