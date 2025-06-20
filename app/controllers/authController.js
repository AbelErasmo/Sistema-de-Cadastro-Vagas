import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/UserModel.js';
import { jwtSecret, jwtExpiresIn } from '../../config/jwtConfig.js';

export const login = (req, res, next) => {
    const { email, password } = req.body;
    const user = User.findByEmail(user => user.email === email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if(!isMatch) return res.status(401).json({ message: 'Senha inválida' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.json({ token });
};