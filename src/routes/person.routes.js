import { Router } from "express";
import token from "../middlewares/auth.js";
import Person from "../models/person.model.js";
import personController from "../controllers/person.js";

const router = Router();

router.get("/listall", token.auth, personController.showAll);

router.post("/register", token.auth, personController.register);

router.get("/:id", token.auth, personController.showOne);

router.get("/assigned/:id", token.auth, personController.showAllFilter);

router.put("/update/:id", token.auth, personController.updatePut);

router.patch("/update/:id", token.auth, personController.updatePatch);

export default router;
