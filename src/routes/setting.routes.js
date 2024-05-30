import { Router } from "express";
import token from "../middlewares/auth.js";
import settingController from "../controllers/setting.controller.js";

const router = Router();

router.get("/", token.auth, settingController.showAll);

router.get("/:name", token.auth, settingController.showOptions);

router.post("/addoption/:name", token.auth, settingController.showAll);

router.post("/addoption/:name", token.auth, settingController.showAll);

export default router;
