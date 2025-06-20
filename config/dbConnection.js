
import mysql from 'mysql2/promise.js';

const dbConnection = async () => {
    // console.log('Conexao com a bd foi estabelecida')
    const connection = await mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "844013",
        database : "portal_vagas"
    });

    connection.connect((error) => {
        if (error) {
            console.error('Erro na conexão com o banco de dados:', err);
        }
        console.log('Conectado ao banco de dados!');
    });

    return connection;
};

export default dbConnection;