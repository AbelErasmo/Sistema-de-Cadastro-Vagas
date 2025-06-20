
import express from 'express';
import { readdir } from 'fs/promises';
import path from 'path';
import dbConnection from './dbConnection.js';
import bodyParserMiddleware from '../app/middlewares/bodyParser.js';
import userRoutes from '../app/routes/userRoutes.js';
import vagasRoutes from '../app/routes/vagaRoutes.js';
import CandidatoRoutes from '../app/routes/candidatoRoutes.js';
import SuperAdminRoutes from '../app/routes/adminRoutes.js';
import EmpresaRoutes from '../app/routes/empresaRoutes.js';
import RecrutadorRoutes from '../app/routes/recrutadorrRoutes.js';
// import { isAdmin } from '../app/middlewares/authMiddleware.js';

const app = express();
const admin = express();
app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('../app/public'));
app.use(bodyParserMiddleware);
// app.use(authenticate);
app.use("/admin", SuperAdminRoutes);
app.use('/api/users', userRoutes);
app.use("/api/empresas", EmpresaRoutes);
app.use("/api/recrutadores", RecrutadorRoutes);
app.use('/api/vagas', vagasRoutes);
app.use('/api/candidatos', CandidatoRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Sistema de Cadastro de Vagas</h1>');
});

const connection = dbConnection();
 
async function loadModules(dir) {
    const files = await readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const module = `file://${path.resolve(filePath)}`;
        if(typeof module.default === 'function') {
            module.default(app, connection);
        }
    }
}

(async () => {
    await loadModules('./app/routes');
    await loadModules('./app/models');
    await loadModules('./app/controllers');
    await loadModules('./app/services');
    await loadModules('./app/middlewares');
})();

export default app;