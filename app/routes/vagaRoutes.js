import express from 'express';
// import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';
import {
    createVagaController,
    updateVagaController,
    deleteVagaController,
    findVagaByIdController,
    findAllVagasController,
    associateCandidatoController,
    incrementarVisualizacoesController
} from '../controllers/vagaController.js';

const router = express.Router();

// Middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// Rotas para gerenciar vagas
router.post('/', createVagaController);
router.put('/:id', updateVagaController);
router.delete('/:id', deleteVagaController);
router.get('/:id', findVagaByIdController);
router.get('/', findAllVagasController);

// Rota para associar candidatos a vagas
router.post('/associate-candidato', associateCandidatoController);

// Rota para incrementar visualizações
router.post('/:id/incrementar-visualizacoes', incrementarVisualizacoesController);

export default router;