import express from 'express';
import RecrutadorController from '../controllers/recrutadorController.js';

const router = express.Router();

// Rota para criar um recrutador
router.post('/', RecrutadorController.create);
// Rota para adicionar uma empresa a um recrutador
router.post('/:recruiterId/empresas/:empresaId', RecrutadorController.addEmpresa);
// Rota para remover uma empresa de um recrutador
router.delete('/:recruiterId/empresas/:empresaId', RecrutadorController.removeEmpresa);
// Rota para buscar um recrutador por ID
router.get('/:recruiterId', RecrutadorController.findById);
// Rota para buscar todos os recrutadores
router.get('/', RecrutadorController.findAll);

export default router;
