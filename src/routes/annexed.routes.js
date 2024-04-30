import { Router } from "express";
import token from "../middlewares/auth.js";
import annexedController from "../controllers/annexed.controller.js";

const router = Router();

router.get("/", token.auth, annexedController.showAll);

router.post("/", token.auth, annexedController.register);

router.post("/masive/:id", token.auth, annexedController.masiveRegister);

export default router;
