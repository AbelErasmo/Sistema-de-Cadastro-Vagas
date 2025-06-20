import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço de e-mail
  auth: {
    user: 'seu_email@gmail.com',
    pass: 'sua_senha'
  }
});

export default transporter;