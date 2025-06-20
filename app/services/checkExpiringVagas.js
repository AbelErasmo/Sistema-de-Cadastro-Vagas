import cron from 'node-cron';
import sendExpiringVagaNotifications from '../services/notificationService.js';

cron.schedule('0 0 * * *', async () => { // Executa todos os dias à meia-noite
  await sendExpiringVagaNotifications();
});