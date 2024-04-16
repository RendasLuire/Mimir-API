import { Router } from "express";
import token from "../middlewares/auth.js";
import Person from "../models/person.model.js";
import personController from "../controllers/person.js";

const router = Router();

const getPerson = async (req, res, next) => {
  let person;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID de la persona no es valido",
    });
  }

  try {
    person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({
        message: "La persona no fue encontrada.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.person = person;
  next();
};

router.get("/listall", token.auth, personController.showAll);

router.post("/register", token.auth, personController.register);

router.get("/:id", token.auth, personController.showOne);

router.put("/update/:id", token.auth, personController.updatePut);

router.patch("/update/:id", token.auth, personController.updatePatch);

router.delete("/:id", getPerson, async (req, res) => {
  try {
    const person = res.person;
    await person.deleteOne({
      _id: person._id,
    });
    res.json({
      message: `La persona ${person.name} fue eliminada correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
