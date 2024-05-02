import { Router } from "express";
import token from "../middlewares/auth.js";
import annexedController from "../controllers/annexed.controller.js";

const router = Router();

router.get("/", token.auth, annexedController.showAll);

router.get("/:id", token.auth, annexedController.showOne);

router.post("/", token.auth, annexedController.register);

router.post("/masive/:id", token.auth, annexedController.masiveRegister);

router.patch("/:id", token.auth, annexedController.updatePatch);

export default router;
