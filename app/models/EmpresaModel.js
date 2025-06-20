class Empresa {
    constructor(nome, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa) {
        this.nome = nome;
        this.categoriaEmpresa = categoriaEmpresa;
        this.enderecoEmpresa = enderecoEmpresa;
        this.emailEmpresa = emailEmpresa;
        this.websiteEmpresa = websiteEmpresa;
    }

    static setConnection(connection) {
        Empresa.connection = connection;
    }

    static async criarEmpresa(empresaData) {
        const { nome, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa } = empresaData;
        const [result] = await Empresa.connection.query(
            'INSERT INTO Empresa (nome, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa) values (?, ?, ?, ?, ?)', 
            [nome, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa]
        );
        return { id: result.insertId, ...empresaData };
    }
    
    static async updateEmpresa(empresaId, empresaData) {
        const { nomeEmpresa, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa } = empresaData;
        await Empresa.connection.query(
            'UPDATE Empresa SET nomeEmpresa=?, categoriaEmpresa=?, enderecoEmpresa=?, emailEmpresa=?, websiteEmpresa=? WHERE id=?',
            [nomeEmpresa, categoriaEmpresa, enderecoEmpresa, emailEmpresa, websiteEmpresa, empresaId]
        );
        return { empresaId, ...empresaData };
    }


    // Aplica o soft DELETE da empresa, alem ser eliminada na totalidade, a empresa sera desativada do sistema
    // Continuando na base de dados como inativa
    static async deleteEmpresa(empresaId) {
        const [result] = await Empresa.connection.query(
            'UPDATE Empresa SET ativo = FALSE WHERE id = ?',
            [empresaId]
        );
        return result.affectedRows > 0;
    }

    static async listarCategorias(empresaId) {
        const [categorias] = await Empresa.connection.query(
            "SELECT categoria FROM Empresa_Categoria WHERE empresaId = ?",
            [empresaId]
        );
        return categorias.map(cat => cat.categoria);
    }

    static async registrarHistorico(empresaId, usuarioId, descricao) {
        await Empresa.connection.query(
            "INSERT INTO Historico_Empresa (empresaId, usuarioId, alteracao) VALUES (?, ?, ?)",
            [empresaId, usuarioId, descricao]
        );
    }    

    static async buscarPorCategoria(categoria) {
        const [empresas] = await Empresa.connection.query(
            `SELECT e.* FROM Empresa e
             JOIN Empresa_Categoria ec ON e.id = ec.empresaId
             WHERE ec.categoria = ?`,
            [categoria]
        );
        return empresas;
    }    

    static async findAll(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const [rows] = await Empresa.connection.query(
            'SELECT * FROM Empresa WHERE ativo = TRUE LIMIT ? OFFSET ?',
            [limite, offset]
        );
        return rows;
    }  

    static async obterEstatisticas(empresaId) {
        const [vagasCriadas] = await Empresa.connection.query(
            "SELECT COUNT(*) AS totalVagas FROM Vaga WHERE empresaId = ?",
            [empresaId]
        );
    
        const [vagasAbertas] = await Empresa.connection.query(
            "SELECT COUNT(*) AS totalAbertas FROM Vaga WHERE empresaId = ? AND status = 'aberta'",
            [empresaId]
        );
    
        const [candidaturas] = await Empresa.connection.query(
            `SELECT COUNT(*) AS totalCandidaturas FROM Candidato_Vaga cv
             JOIN Vaga v ON cv.vagaId = v.id
             WHERE v.empresaId = ?`,
            [empresaId]
        );

        return {
            totalVagas: vagasCriadas[0].totalVagas,
            vagasAbertas: vagasAbertas[0].totalAbertas,
            totalCandidaturas: candidaturas[0].totalCandidaturas
        };
    }
    
    static async findById(empresaId) {
        const [rows] = await Empresa.connection.query('SELECT * FROM Empresa WHERE id=?', [empresaId]);
        return rows[0];
    }

}

export default Empresa;