import dbConnection from '../config/dbConnection.js';

test('Conexão com o banco de dados deve ser estabelecida', async () => {
    try {
        const connection = await dbConnection();
        expect(connection).toBeDefined();
        await connection.end();
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
});
