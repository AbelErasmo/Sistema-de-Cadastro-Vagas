import Candidato from '../models/CandidatoModel.js';

class CandidatoController {
    static async criarCandidato(req, res) {
        try {
            const candidatoData = req.body;
            Candidato.validarCandidato(candidatoData);
            await Candidato.verificarEmailExistente(candidatoData.email);

            const candidato = await Candidato.createCandidato(candidatoData);
            res.status(201).json(candidato);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async atualizarCandidato(req, res) {
        try {
            const candidatoId = req.params.id;
            const candidatoData = req.body;

            const candidato = await Candidato.updateCandidato(candidatoId, candidatoData);
            res.status(200).json(candidato);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async excluirCandidato(req, res) {
        try {
            const candidatoId = req.params.id;

            await Candidato.deleteCandidato(candidatoId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async buscarCandidatoPorId(req, res) {
        try {
            const candidatoId = req.params.id;

            const candidato = await Candidato.findCandidatoById(candidatoId);
            if (!candidato) {
                return res.status(404).json({ error: 'Candidato não encontrado' });
            }
            res.status(200).json(candidato);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async listarCandidatos(req, res) {
        try {
            const candidatos = await Candidato.findAllCandidatos();
            res.status(200).json(candidatos);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default CandidatoController;