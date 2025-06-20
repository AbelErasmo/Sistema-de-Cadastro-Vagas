import User from "./UserModel.js";
import Empresa from "./EmpresaModel.js";

class Recrutador extends User {
    constructor(name, email, password, empresaId, cargo) {
        super(email, password, 'recrutador');
        this.name = name;
        this.empresaId = empresaId;
        this.cargo = cargo;
    }

    static setConnection(connection) {
        Recrutador.connection = connection;
    }
    
    static async createRecrutador(recrutadorData) {
        const { email, password, name, endereco, cargo, empresaIds } = recrutadorData;

        // Validando os dados antes que sejam feitas operações no banco de dados
        if (!email || !password || !name || !endereco || !cargo || !Array.isArray(empresaIds)) {
            throw new Error('Dados inválidos fornecidos');
        }

        const connection = Recrutador.connection;
        try {
            await connection.beginTransaction();

            // Cria um usuário que e recrutador
            const { id: userId } = await User.createUser({ email, password, categoria: 'recrutador' });

            // Cria um recrutador sem vincular diretamente a uma empresa
            const [result] = await connection.query(
                'INSERT INTO Recrutador (userId, name, endereco, cargo) VALUES (?, ?, ?, ?)',
                [userId, name, endereco, cargo]
            );
            const recruiterId = result.insertId;

            // Associa um recrutador às empresas que presta servicos
            for (const empresaId of empresaIds) {
                const empresaExists = await Empresa.findById(empresaId);
                if (!empresaExists) {
                    throw new Error(`Empresa com ID ${empresaId} não encontrada.`);
                }

                await Recrutador.connection.query(
                    'INSERT INTO Recrutador_Empresa (recrutadorId, empresaId) VALUES (?, ?)',
                    [recruiterId, empresaId]
                );
            }

            await connection.commit();
            return { id: recruiterId };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    static async addEmpresaToRecrutador(recruiterId, empresaId) {
        const empresaExists = await Empresa.findById(empresaId);
        if (!empresaExists) {
            throw new Error('Empresa não encontrada.');
        }

        await Recrutador.connection.query(
            'INSERT INTO Recrutador_Empresa (recrutadorId, empresaId) VALUES (?, ?)',
            [recruiterId, empresaId]
        );
    }

    static async removeEmpresaFromRecrutador(recruiterId, empresaId) {
        await Recrutador.connection.query(
            'DELETE FROM Recrutador_Empresa WHERE recrutadorId=? AND empresaId=?',
            [recruiterId, empresaId]
        );
    }

    static async findRecrutadorById(recruiterId) {
        const [recrutadores] = await Recrutador.connection.query(
            'SELECT * FROM Recrutador WHERE id = ?',
            [recruiterId]
        );

        if (recrutadores.length === 0) {
            throw new Error(`Recrutador com ID ${recruiterId} não encontrado.`);
        }

        const recrutador = recrutadores[0];
        const [empresas] = await Recrutador.connection.query(
            'SELECT Empresa.* FROM Empresa INNER JOIN Recrutador_Empresa ON Empresa.id = Recrutador_Empresa.empresaId WHERE Recrutador_Empresa.recrutadorId = ?',
            [recruiterId]
        );

        return { ...recrutador, empresas };
    }

    static async findAllRecrutadores() {
        const [recrutadores] = await Recrutador.connection.query('SELECT * FROM Recrutador');

        for (const recrutador of recrutadores) {
            const [empresas] = await Recrutador.connection.query(
                'SELECT Empresa.* FROM Empresa INNER JOIN Recrutador_Empresa ON Empresa.id = Recrutador_Empresa.empresaId WHERE Recrutador_Empresa.recrutadorId = ?',
                [recrutador.id]
            );
            recrutador.empresas = empresas;
        }

        return recrutadores;
    }
}

export default Recrutador;

