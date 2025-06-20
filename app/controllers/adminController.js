// import SuperAdmin from "../models/SuperAdminModel.js";
import User from "../models/UserModel.js";

const SuperAdminController = {
    // Criar um novo usuário
    async createUser(req, res) {
        try {
            const { email, password, categoria } = req.body;

            if (!email || !password || !categoria) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            const newUser = await User.createUser({ email, password, categoria });
            return res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Atualizar um usuário
    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const userData = req.body;

            if (!userId) {
                return res.status(400).json({ error: "ID do usuário é obrigatório." });
            }

            const updatedUser = await User.updateUser(userId, userData);
            return res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Excluir um usuário
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ error: "ID do usuário é obrigatório." });
            }

            const deleted = await User.deleteUser(userId);
            if (!deleted) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            return res.status(200).json({ message: "Usuário deletado com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Listar todos os usuários
    async listUsers(req, res) {
        try {
            const users = await User.findAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Buscar usuário por ID
    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export default SuperAdminController;
