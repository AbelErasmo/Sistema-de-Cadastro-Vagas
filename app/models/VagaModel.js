
class Vaga {
    static MAX_VAGAS_POR_RECRUTADOR = 5;

    constructor(titulo, descricao, requisitos, localizacao) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.requisitos = requisitos;
        this.localizacao = localizacao;
    }

    static setConnection(connection) {
        Vaga.connection = connection;
    }

    static async createVaga(vagaData, user) {
        const { empresaId, titulo, descricao, salario, localizacao, tipo, status, categoria, recrutadorIds, periodoExpiracao } = vagaData;
        const statusVaga = ['aberta', 'fechada', 'pausada', 'em andamento']
        const tiposValidosVagas  = ['CTL', 'Freelancer', 'Estágio', 'Voluntário'];
        const MAX_RECRUTADORES = 2;

        if (!empresaId || !titulo || !descricao || !salario || !localizacao || !tipo || !status || !categoria || !Array.isArray(recrutadorIds)) {
            throw new Error('Dados inválidos para criação de vaga.');
        }

        if (!statusVaga.includes(status)) {
            throw new Error('Status fornecido inválido');
        }

        if (!tiposValidosVagas.includes(tipo)) {
            throw new Error('Tipo de vaga inválido. Permitidos: CLT, Freelancer, Estágio e Voluntário.');
        }

        if(isNaN(salario) || salario <= 0) {
            throw new Error('Salario invalido. Deve ser um numero positivo');
        }

        if (recrutadorIds.length > MAX_RECRUTADORES) {
            throw new Error(`Uma vaga pode ter no maximo ${MAX_RECRUTADORES} recrutadores`);
        }     

        // Validacao do periodo de expiracao de vaga
        const expiracaoValida = [15, 30, 60, 90];
        if (!expiracaoValida.includes(periodoExpiracao)) {
            throw new Error('Período de expiração inválido. Periodo permito 15, 30, 60 ou 90 dias.');
        }
        const connection = Vaga.connection;
        try {
            await connection.beginTransaction();

            // Verifica-se a categoria da vaga e permitida pela empresa
            const [categoriasPermitidas] = await Vaga.connection.query(
                'SELECT categoria FROM Empresa_Categoria WHERE empresaId = ?',
                [empresaId]
            );

            const categoriasValidas = categoriasPermitidas.map(cat => cat.categoria);

            if (!categoriasValidas.includes(categoria)) {
                throw new Error("A categoria da vaga não é permitida para a empresa.")
            }

            // Verificar se o recrutador já atingiu o limite de vagas
            for (const recrutadorId of recrutadorIds) {
                const [vagasActuais] = await Vaga.connection.query(
                    "SELECT COUNT(*) AS total FROM Vaga v JOIN Recrutador_Vaga rv ON v.id = rv.vagaId WHERE rv.recrutadorId = ? AND v.status IN ('aberta', 'em andamento')",
                    [recrutadorId]
                );

                if (vagasActuais[0].total >= Vaga.MAX_VAGAS_POR_RECRUTADOR) {
                    throw new Error(`O recrutador ${recrutadorId} já atingiu o limte de ${Vaga.MAX_VAGAS_POR_RECRUTADOR} vagas.`);
                }
            }

            const [vagaExiste] = await Vaga.connection.query(
                'SELECT id FROM Vaga WHERE empresaId = ? AND titulo = ? AND descricao = ?'
                [empresaId, titulo, descricao]
            );

            if (vagaExiste.length > 0) {
                throw new Error("Já existe uma vaga com esse título e descrição para essa empresa.");
            }

            // Verificando se a empresa existe
            const empresaExists = await Empresa.findById(empresaId);
            if (!empresaExists) throw new Error("Empresa não encontrada.");

            // Garantindo que uma empresa de facto pertence ao recrutador que pretende criar a vaga
            // Caso ele nao seja um admin
            if(user.categoria === 'recrutador') {
                const [recrutadoreEmpresa] = await Vaga.connection.query(
                    'SELECT id FROM Recrutador WHERE userId = ? AND empresaId = ?',
                    [user.id, empresaId] 
                );
                if(recrutadoreEmpresa.length === 0) {
                    throw new Error("Não tem permissão para criar vagas nessa empresa.");
                }
            }

            const dataCriacao = new Date();
            const dataExpiracao = new Date();
            dataExpiracao.setDate(dataExpiracao.getDate() + periodoExpiracao); // Uma vaga expira em 15, 30, 60 ou 90 dias
            
            // Cria a vaga com data de criacao
            const [result] = await connection.query(
                "INSERT INTO Vaga (empresaId, titulo, descricao, salario, localizacao, tipo, status, categoria, dataCriacao, dataExpiracao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [empresaId, titulo, descricao, salario, localizacao, tipo, status, categoria, dataCriacao, dataExpiracao]
            );

            const vagaId = result.insertId;

            // Validando os recrutadores se existem antes de lhes associar a uma vaga
            if (recrutadorIds.length > 0) {
                const [recrutadorValido] = await Vaga.connection.query(
                    'SELECT id FROM Recrutador WHERE id IN (?)',
                    [recrutadorIds]
                );

                const recrutadorValidoId = recrutadorValido.map(r => r.id);

                if(recrutadorValidoId.length !== recrutadorIds.length) {
                    throw new Error("Um ou mais recrutadores nao sao validos");
                }

                // Associa um recrutador a uma vaga apos passar pela validacao
                for (const recruiterId of recrutadorValidoId) {
                    await Vaga.connection.query(
                        "INSERT INTO Recrutador_Vaga (vagaId, recrutadorId) values (?, ?)",
                        [vagaId, recruiterId]
                    );
                }
            }

            // Se o usuário for administrador, será associado à vaga
            if (user && user.categoria === 'admin') {
                await Vaga.connection.query(
                    "INSERT INTO Vaga_Admin (vagaId, adminId) VALUES (?, ?)",
                    [vagaId, user.id]
                );
            }
            await connection.commit();
            return { id: vagaId };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    // Metodo para rastrear o historico de alteracoes da vaga
    static async logUpdate(vagaId, descricaoAlteracao, userId) {
        await Vaga.connection.query(
            'INSERT INTO Historico_Vaga (vagaId, userId, descricao, dataAlteracao) VALUES (?, ?, ?, ?)', 
            [vagaId, userId, descricaoAlteracao, new Date()]
        );
    }

    // Metodo para incrementar o contador de visualizacoes
    static async incrementarVisualizacoes(vagaId) {
        await Vaga.connection.query(
            'UPDATE Vaga SET contadorVisualizacoes = contadorVisualizacoes + 1 WHERE id = ?',
            [vagaId]
        );
    }

    static async findVagaById(vagaId) {
        const [rows] = await Vaga.connection.query(
            "SELECT * FROM Vaga WHERE id = ?",
            [vagaId]
        );

        if (rows.length === 0) return null;

        const vaga = rows[0];

        // Busca por recrutadores associados
        const [recrutadores] = await Vaga.connection.query(
            "SELECT Recrutador.* FROM Recrutador INNER JOIN Recrutador_Vaga ON Recrutador.id = Recrutador_Vaga.recrutadorId WHERE Recrutador_Vaga.vagaId = ?",
            [vagaId]
        );

        return { ...vaga, recrutadores };
    }

    static async findAllVagas() {
        const [vagas] = await Vaga.connection.query("SELECT * FROM Vaga");
        for (const vaga of vagas) {
            const [recrutadores] = await Vaga.connection.query(
                "SELECT Recrutador.* FROM Recrutador INNER JOIN Recrutador_Vaga ON Recrutador.id = Recrutador_Vaga.recrutadorId WHERE Recrutador_Vaga.vagaId = ?",
                [vaga.id]
            );
            vaga.recrutadores = recrutadores;
        }
        return vagas;
    }

    // Actulizando vaga com restricoes
    static async updateVaga(vagaId, vagaData, user) {
        const { titulo, descricao, salario, localizacao, tipo, status, categoria, dataCriacao, periodoExpiracao } = vagaData;
        const tiposValidosVagas = ['CTL', 'Freelancer', 'Estagio', 'Voluntario'];

        if (!vagaId || !titulo || !descricao || !salario || !localizacao || !tipo || !status || !categoria) {
            throw new Error('Dados inválidos para atualização.');
        }

        if (!tiposValidosVagas.includes(tipo)) {
            throw new Error('Tipo de vaga invalido.');
        }

        if (isNaN(salario) || salario <= 0) {
            throw new Error('Salário inválido. Deve ser um número positivo.');
        }

        try {
            // Verifica se a vaga existe
            const [vaga] = await Vaga.connection.query(
                'SELECT * FROM Vaga WHERE id = ?', [vagaId]
            );
            if (vaga.length === 0) throw new Error("Vaga nao encontrada.");

            if (user.categoria !== 'admin') {
                const [recrutadorVaga] = await Vaga.connection.query(
                    'SELECT rv.recrutadorId FROM Recrutador_Vaga, rv JOIN Recrutador r ON rv.recrutadorId = r.id WHERE rv.vagaId=? AND r.userId=?',
                    [vagaId, user.id]
                );

                if (recrutadorVaga.length === 0) {
                    throw new Error('Não tem permissão para editar essa vaga');
                }
            }
            
            // Actualizando a vaga
            await Vaga.connection.query(
                "UPDATE Vaga SET titulo = ?, descricao = ?, salario = ?, localizacao = ?, tipo = ?, status = ?, categoria = ? WHERE id = ?",
                [titulo, descricao, salario, localizacao, tipo, status, categoria, vagaId, dataCriacao, periodoExpiracao]
            );
            return { message: "Vaga actualizada com sucesso."};
        } catch (error) {
            throw error;
        }
    }

    // Cadidatos associados a uma vaga
    static async associateWithCandidato(vagaId, candidatoId) {
        await Vaga.connection.query(
            'INSERT INTO Candidato_Vaga (vagaId, candidatoId) VALUES (?, ?)',
            [vagaId, candidatoId]
        );
    }
    
    static async findCandidatosByVagaId(vagaId) {
        const [candidatos] = await Vaga.connection.query(
            'SELECT Candidato.* FROM Candidato INNER JOIN Candidato_Vaga ON Candidato.userId = Candidato_Vaga.candidatoId WHERE Candidato_Vaga.vagaId = ?',
            [vagaId]
        );
        return candidatos;
    }
    
    // Este metodo permite aos candidatos que marquem as vagas como favoritas
    static async favoritarVaga(vagaId, candidatoId) {
        await Vaga.connection.query(
            "INSERT INTO Favoritos_Vaga (vagaId, candidatoId) VALUES (?, ?) ON DUPLICATE KEY UPDATE dataAdicao = NOW()",
            [vagaId, candidatoId]
        );
    }
    
    // Este metodo permite aos candidados que possam avaliar as vagas publicadas na plataforma
    static async avaliarVaga(vagaId, candidatoId, nota, comentario) {
        if (nota < 1 || nota > 5) {
            throw new Error("A nota deve estar entre 1 e 5.");
        }
    
        await Vaga.connection.query(
            "INSERT INTO Avaliacao_Vaga (vagaId, candidatoId, nota, comentario) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nota = ?, comentario = ?, dataAvaliacao = NOW()",
            [vagaId, candidatoId, nota, comentario, nota, comentario]
        );
    }

    // Metodo para buscar recomendacoes de vagas
    static async recomendarVagas(candidatoId) {
        const [vagas] = await Vaga.connection.query(
            `SELECT v.* FROM Vaga v
             JOIN Candidato_Vaga cv ON v.categoria = (
                 SELECT categoria FROM Vaga WHERE id = cv.vagaId LIMIT 1
             )
             WHERE cv.candidatoId = ? AND v.status = 'aberta'
             ORDER BY v.dataCriacao DESC
             LIMIT 5`,
            [candidatoId]
        );
        return vagas;
    }  

    // Verifica as vagas que estao prestes a expirar e envia notificao ao recrutador
    static async findExpiringVagas() {
        const query = `
          SELECT v.id, v.titulo, v.dataExpiracao, u.email
          FROM Vaga v
          JOIN Recrutador_Vaga rv ON v.id = rv.vagaId
          JOIN Recrutador r ON rv.recrutadorId = r.id
          JOIN User u ON r.userId = u.id
          WHERE v.dataExpiracao <= DATE_ADD(NOW(), INTERVAL 3 DAY);
        `;
        const [rows] = await Vaga.connection.query(query);
        return rows;
      }

    // Adicao de filtros avancados  que facilitam a pesquisa de vagas
    static async buscarVagas({ localizacao, tipo, salarioMin, salarioMax }) {
        const [vagas] = await Vaga.connection.query(
            `SELECT * FROM Vaga
             WHERE status = 'aberta'
             AND (? IS NULL OR localizacao = ?)
             AND (? IS NULL OR tipo = ?)
             AND (? IS NULL OR salario BETWEEN ? AND ?)`,
            [localizacao, localizacao, tipo, tipo, salarioMin, salarioMin, salarioMax]
        );
        return vagas;
    }
    
    static async deleteVaga(vagaId) {
        await Vaga.connection.query("DELETE FROM Vaga WHERE id = ?", [vagaId]);
    }
}

export default Vaga;