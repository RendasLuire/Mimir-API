import { Router } from "express";
import token from "../middlewares/auth.js";
import computerController from "../controllers/computer.js";

const router = Router();

router.get("/listall", token.auth, computerController.showAll);

router.post("/register", token.auth, computerController.register);

router.get("/:id", token.auth, computerController.showOne);

router.put("/update/:id", token.auth, computerController.updatePut);

router.patch("/update/:id", token.auth, computerController.updatePatch);

router.delete("/:id", token.auth, computerController.deleteOne);

export default router;
