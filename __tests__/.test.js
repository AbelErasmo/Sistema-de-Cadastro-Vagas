import Empresa from '../app/models/EmpresaModel.js';
import dbConnection from '../config/dbConnection.js';

describe('Empresa Model', () => {
    let connection;

    beforeAll(async () => {
        connection = await dbConnection();
        Empresa.setConnection(connection);
    });

    afterAll(async () => {
        await connection.end();
    });

    // afterEach(async () => {
    //     // Limpar a tabela Empresa após cada teste
    //     await connection.query('DELETE FROM Empresa');
    // });

    test('criarEmpresa deve criar uma nova empresa', async () => {
        const empresaData = {
            nome: 'Empresa Teste',
            categoriaEmpresa: 'Tecnologia',
            enderecoEmpresa: 'Endereço Teste',
            emailEmpresa: 'empresa@example.com',
            websiteEmpresa: 'www.empresa.com'
        };

        const result = await Empresa.criarEmpresa(empresaData);

        // Verificar se a empresa foi inserida na tabela Empresa
        const [empresaRows] = await connection.query('SELECT * FROM Empresa WHERE emailEmpresa = ?', [empresaData.emailEmpresa]);
        expect(empresaRows.length).toBe(1);
        expect(empresaRows[0]).toMatchObject({
            nome: empresaData.nomeEmpresa,
            categoriaEmpresa: empresaData.categoriaEmpresa,
            enderecoEmpresa: empresaData.enderecoEmpresa,
            emailEmpresa: empresaData.emailEmpresa,
            websiteEmpresa: empresaData.websiteEmpresa
        });

        expect(result).toEqual({ id: empresaRows[0].id, ...empresaData });
    });
});