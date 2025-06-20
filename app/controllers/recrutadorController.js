import Recrutador from '../models/RecrutadorModel.js';

class RecrutadorController {
    // Criação de um novo recrutador
    static async create(req, res) {
        try {
            const recrutadorData = req.body; // Supondo que você está enviando os dados no corpo da requisição

            const recrutador = await Recrutador.createRecrutador(recrutadorData);
            res.status(201).json({ message: 'Recrutador criado com sucesso', recrutador });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

    // Adicionar uma empresa a um recrutador
    static async addEmpresa(req, res) {
        try {
            const { recruiterId, empresaId } = req.params;

            await Recrutador.addEmpresaToRecrutador(recruiterId, empresaId);
            res.status(200).json({ message: 'Empresa associada ao recrutador com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

    // Remover uma empresa de um recrutador
    static async removeEmpresa(req, res) {
        try {
            const { recruiterId, empresaId } = req.params;

            await Recrutador.removeEmpresaFromRecrutador(recruiterId, empresaId);
            res.status(200).json({ message: 'Empresa removida do recrutador com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

    // Buscar um recrutador por ID
    static async findById(req, res) {
        try {
            const { recruiterId } = req.params;

            const recrutador = await Recrutador.findRecrutadorById(recruiterId);
            res.status(200).json(recrutador);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

    // Buscar todos os recrutadores
    static async findAll(req, res) {
        try {
            const recrutadores = await Recrutador.findAllRecrutadores();
            res.status(200).json(recrutadores);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
}

export default RecrutadorController;
