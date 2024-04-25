import { Router } from "express";
import token from "../middlewares/auth.js";
import movementController from "../controllers/movement.controller.js";

const router = Router();

router.get("/", token.auth, movementController.showAll);
router.get("/:id", token.auth, movementController.showAllFilter);

export default router;
