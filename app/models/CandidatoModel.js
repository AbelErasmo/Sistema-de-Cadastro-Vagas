import User from "./UserModel.js";

class Candidato extends User {
    constructor(name, email, password, telefone, endereco, experiencia, habilidades) {
        super(email, password, "candidato");
        this.name = name;
        this.telefone = telefone;
        this.endereco = endereco;
        this.experiencia = experiencia;
        this.habilidades = habilidades;
    }

    static setConnection(connection) {
        Candidato.connection = connection;
    }

    static validarCandidato(candidatoData) {
        const { email, password, name, telefone, endereco, experiencia, habilidades } = candidatoData;
        if (!email || !password || !name || !telefone || !endereco) {
            throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
        }
    }

    static async verificarEmailExistente(email) {
        const [rows] = await Candidato.connection.query("SELECT id FROM User WHERE email = ?", [email]);
        if (rows.length > 0) {
            throw new Error("Este e-mail já está cadastrado.");
        }
    }

    static async registrarHistorico(userId, descricao) {
        await Candidato.connection.query(
            "INSERT INTO Historico_Candidato (userId, descricao, data) VALUES (?, ?, NOW())",
            [userId, descricao]
        );
    }

    static async createCandidato(candidatoData) {
        await this.verificarEmailExistente(candidatoData.email);
        this.validarCandidato(candidatoData);

        const { email, password, name, telefone, endereco, experiencia, habilidades } = candidatoData;
        const user = await User.createUser({ email, password, categoria: "candidato" });

        // Esta funcao cria um candidato assiciado a um candidato
        const [candidatoResult] = await Candidato.connection.query(
            "INSERT INTO Candidato (userId, name, telefone, endereco, experiencia, habilidades) VALUES (?, ?, ?, ?, ?, ?)",
            [user.id, name, telefone, endereco, experiencia, habilidades]
        );

        return { id: candidatoResult.insertId, userId: user.id, ...candidatoData };
    }

    static async updateCandidato(id, candidatoData) {
        this.validarCandidato(candidatoData);

        const { email, password, name, telefone, endereco, experiencia, habilidades } = candidatoData;
        await User.updateUser(id, { email, password, categoria: "candidato" });

        await Candidato.connection.query(
            "UPDATE Candidato SET name=?, telefone=?, endereco=?, experiencia=?, habilidades=? WHERE userId=?",
            [name, telefone, endereco, experiencia, habilidades, id]
        );

        await this.registrarHistorico(id, "Perfil atualizado.");

        return { id, ...candidatoData };
    }

    static async deleteCandidato(id) {
        await Candidato.connection.query("UPDATE User SET ativo = FALSE WHERE id = ?", [id]);
        await this.registrarHistorico(id, "Conta desativada.");
    }

    static async findByCandidatoId(id) {
        const [rows] = await Candidato.connection.query("SELECT * FROM Candidato WHERE userId=?", [id]);
        return rows[0];
    }

    static async findAllCandidatos(pagina = 1, limite = 10, filtro = "") {
        const offset = (pagina - 1) * limite;
        const [rows] = await Candidato.connection.query(
            `SELECT * FROM Candidato 
             WHERE name LIKE ? OR habilidades LIKE ? 
             LIMIT ? OFFSET ?`,
            [`%${filtro}%`, `%${filtro}%`, limite, offset]
        );
        return rows;
    }
}

export default Candidato;
