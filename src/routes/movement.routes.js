import { Router } from "express";
import token from "../middlewares/auth.js";
import movementController from "../controllers/movement.js";

const router = Router();

router.get("/listall", token.auth, movementController.showAll);
router.get("/listall/:id", token.auth, movementController.showAllFilter);

export default router;
