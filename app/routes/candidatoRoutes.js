import express from 'express';
import CandidatoController from "../controllers/candidatoController.js";

const router = express.Router({ mergeParams: true });

router.post('/', CandidatoController.criarCandidato);
router.put('/:id', CandidatoController.atualizarCandidato);
router.delete('/:id', CandidatoController.excluirCandidato);
router.get('/:id', CandidatoController.buscarCandidatoPorId);
router.get('/', CandidatoController.listarCandidatos);

export default router;
