import Empresa from "../models/EmpresaModel.js";

const EmpresaController = {
    // Criar uma nova empresa
    async criarEmpresa(req, res) {
        try {
            const empresaData = req.body;

            if (!empresaData.nome || !empresaData.categoriaEmpresa || !empresaData.enderecoEmpresa || !empresaData.emailEmpresa) {
                return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
            }

            const novaEmpresa = await Empresa.criarEmpresa(empresaData);
            return res.status(201).json({ message: "Empresa criada com sucesso!", empresa: novaEmpresa });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Atualizar uma empresa
    async atualizarEmpresa(req, res) {
        try {
            const { empresaId } = req.params;
            const empresaData = req.body;

            if (!empresaId) {
                return res.status(400).json({ error: "ID da empresa é obrigatório." });
            }

            const empresaAtualizada = await Empresa.updateEmpresa(empresaId, empresaData);
            return res.status(200).json({ message: "Empresa atualizada com sucesso!", empresa: empresaAtualizada });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Soft delete para inativar uma empresa
    async deletarEmpresa(req, res) {
        try {
            const { empresaId } = req.params;

            if (!empresaId) {
                return res.status(400).json({ error: "ID da empresa é obrigatório." });
            }

            const sucesso = await Empresa.deleteEmpresa(empresaId);
            if (!sucesso) {
                return res.status(404).json({ error: "Empresa não encontrada." });
            }

            return res.status(200).json({ message: "Empresa desativada com sucesso!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Listar todas as empresas ativas (com paginação)
    async listarEmpresas(req, res) {
        try {
            const { pagina = 1, limite = 10 } = req.query;
            const empresas = await Empresa.findAll(Number(pagina), Number(limite));

            return res.status(200).json(empresas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Buscar uma empresa por ID
    async obterEmpresaPorId(req, res) {
        try {
            const { empresaId } = req.params;
            const empresa = await Empresa.findById(empresaId);

            if (!empresa) {
                return res.status(404).json({ error: "Empresa não encontrada." });
            }

            return res.status(200).json(empresa);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Buscar empresas por categoria
    async buscarEmpresasPorCategoria(req, res) {
        try {
            const { categoria } = req.params;

            if (!categoria) {
                return res.status(400).json({ error: "Categoria é obrigatória." });
            }

            const empresas = await Empresa.buscarPorCategoria(categoria);
            return res.status(200).json(empresas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Listar categorias de uma empresa
    async listarCategoriasEmpresa(req, res) {
        try {
            const { empresaId } = req.params;
            const categorias = await Empresa.listarCategorias(empresaId);

            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Registrar histórico de alterações na empresa
    async registrarHistorico(req, res) {
        try {
            const { empresaId, usuarioId } = req.params;
            const { descricao } = req.body;

            if (!descricao) {
                return res.status(400).json({ error: "A descrição da alteração é obrigatória." });
            }

            await Empresa.registrarHistorico(empresaId, usuarioId, descricao);
            return res.status(201).json({ message: "Histórico registrado com sucesso!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Obter estatísticas da empresa (número de vagas, candidaturas, etc.)
    async obterEstatisticas(req, res) {
        try {
            const { empresaId } = req.params;
            const estatisticas = await Empresa.obterEstatisticas(empresaId);

            return res.status(200).json(estatisticas);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export default EmpresaController;
