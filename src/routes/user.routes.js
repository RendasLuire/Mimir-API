import { Router } from "express";
import token from "../middlewares/auth.js";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", token.auth, userController.showAll);

router.post("/login", userController.login);

router.post("/", token.auth, userController.register);

router.get("/:id", token.auth, userController.showOne);

router.patch("/:id", token.auth, userController.updatePatch);

router.delete("/:id", token.auth, userController.deleteOne);

export default router;
