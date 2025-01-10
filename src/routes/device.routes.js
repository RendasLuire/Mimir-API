import { Router } from "express";
import token from "../middlewares/auth.js";
import deviceController from "../controllers/device.controller.js";

const router = Router();

router.get("/", token.auth, deviceController.showAll);

router.post("/", token.auth, deviceController.register);

router.get("/showOne/:id", token.auth, deviceController.showOne);

router.patch("/:id", token.auth, deviceController.updatePatch);

router.patch("/assing/:id", token.auth, deviceController.assing);

router.patch("/unassing/:id", token.auth, deviceController.unassing);

router.patch("/assingMonitor/:id", token.auth, deviceController.assingMonitor);

router.patch(
  "/unassingMonitor/:id",
  token.auth,
  deviceController.unassingMonitor
);

router.patch("/changeDevice/:id", token.auth, deviceController.changeDevice);

router.get("/monitors/", token.auth, deviceController.ShowMonitors);
router.get("/printers/", token.auth, deviceController.ShowPrinters);

router.get("/:id/comments", deviceController.listComments);
router.post("/:id/comments", deviceController.addComment);
router.delete("/:id/comments/:commentId", deviceController.deleteComment);

export default router;
