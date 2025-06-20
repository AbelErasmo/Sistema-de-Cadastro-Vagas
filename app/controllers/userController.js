
import User from "../models/UserModel.js";

export const createUserController = async (req, res) => {
    try {
        const newUser = await User.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUserController = async (req, res) => {
    try {
        const { id } = body.params;
        const updatedUser = await User.updateUser(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        await User.deleteUser(id);
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


