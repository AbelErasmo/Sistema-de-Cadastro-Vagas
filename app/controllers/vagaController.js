import Vaga from '../models/VagaModel.js';

export const createVagaController = async (req, res) => {
    try {
        const newVaga = await Vaga.createVaga(req.body, req.user);
        res.status(201).json(newVaga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateVagaController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVaga = await Vaga.updateVaga(id, req.body, req.user);
        res.status(200).json(updatedVaga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteVagaController = async (req, res) => {
    try {
        const { id } = req.params;
        await Vaga.deleteVaga(id);
        res.status(200).json({ message: 'Vaga excluída com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const findVagaByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const vaga = await Vaga.findById(id);
        res.status(200).json(vaga);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const findAllVagasController = async (req, res) => {
    try {
        const vagas = await Vaga.findAll();
        res.status(200).json(vagas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const associateCandidatoController = async (req, res) => {
    try {
        const { vagaId, candidatoId } = req.body;
        await Vaga.associateWithCandidato(vagaId, candidatoId);
        res.status(200).json({ message: 'Candidato associado à vaga com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const incrementarVisualizacoesController = async (req, res) => {
    try {
        const { id } = req.params;
        await Vaga.incrementarVisualizacoes(id);
        res.status(200).json({ message: 'Visualização incrementada com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};
