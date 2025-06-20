import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config/jwtConfig.js';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    jwt.verify(token, jwtSecret, (err, user) => {
        if(err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Acesso não autorizado' });
    }
};
