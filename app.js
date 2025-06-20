
import app from './config/server.js';
import { cpuUsage } from 'node:process';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`O servidor rodando na porta ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Encerrando o servidor...');
    app.close(() => {
        console.log('Servidor encerrando.');
        process.exit(0);
    });
});

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
