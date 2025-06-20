import express from "express";
import EmpresaController from "../controllers/EmpresaController.js";

const router = express.Router();

router.post("", EmpresaController.criarEmpresa);
router.put("/:empresaId", EmpresaController.atualizarEmpresa);
router.delete("/:empresaId", EmpresaController.deletarEmpresa);

// Listar empresas ativas com paginação
router.get("/", EmpresaController.listarEmpresas);
// Buscar empresa por ID
router.get("/:empresaId", EmpresaController.obterEmpresaPorId);
// Buscar empresas por categoria
router.get("/categoria/:categoria", EmpresaController.buscarEmpresasPorCategoria);
// Listar categorias de uma empresa
router.get("/:empresaId/categorias", EmpresaController.listarCategoriasEmpresa);
// Registrar histórico de alterações na empresa
router.post("/:empresaId/historico/:usuarioId", EmpresaController.registrarHistorico);
// Obter estatísticas da empresa
router.get("/:empresaId/estatisticas", EmpresaController.obterEstatisticas);

export default router;
