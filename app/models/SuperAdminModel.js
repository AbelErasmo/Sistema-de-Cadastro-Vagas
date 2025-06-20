import User from "./UserModel.js";

const ACTIONS = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
};

class SuperAdmin extends User {
    constructor(email, password) {
        super(email, password, 'admin');
    }

    async manageUsers(action, userId = null, userData = null) {
        if (!Object.values(ACTIONS).includes(action)) {
            throw new Error('Ação inválida');
        }

        if (action === ACTIONS.CREATE && !userData) {
            throw new Error('Dados do usuário são necessários para criação');
        }

        if ((action === ACTIONS.UPDATE || action === ACTIONS.DELETE) && !userId) {
            throw new Error('ID do usuário é necessário para essa ação');
        }

        if (action === ACTIONS.DELETE && userId === this.id) {
            throw new Error('Você não pode excluir sua própria conta.');
        }

        if (this.categoria !== 'admin') {
            throw new Error('Acesso negado. Apenas SuperAdmins podem gerenciar usuários.');
        }

        switch (action) {
            case ACTIONS.CREATE:
                return await User.createUser(userData);
            case ACTIONS.UPDATE:
                return await User.updateUser(userId, userData);
            case ACTIONS.DELETE:
                return await User.deleteUser(userId);
        }
    }
}

export default SuperAdmin;
