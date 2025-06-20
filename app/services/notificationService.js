
import transporter from '../../config/nodemailerConfig.js';
import Vaga from '../models/VagaModel.js';

const sendExpiringVagaNotifications = async () => {
  try {
    const expiringVagas = await Vaga.findExpiringVagas();

    for (const vaga of expiringVagas) {
      const mailOptions = {
        from: 'seu_email@gmail.com',
        to: vaga.email,
        subject: 'Notificação de Expiração de Vaga',
        text: `A vaga "${vaga.titulo}" está prestes a expirar em ${vaga.dataExpiracao}. Por favor, tome as ações necessárias.`
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Erro ao enviar notificações de vagas expirando:', error);
  }
};

export default sendExpiringVagaNotifications;
