import express from "express";
import ChamadoController from "../controllers/chamado.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", ChamadoController.criar);
router.get("/", auth, ChamadoController.listar);
router.get("/:id", auth, ChamadoController.buscarPorId);
router.patch("/:id/status", auth, ChamadoController.atualizarStatus);
router.delete("/:id", auth, ChamadoController.deletar);

export default router;
