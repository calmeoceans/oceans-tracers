const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail({ to, subject, text }) {
    const mailOptions = {
      from: process.env.SMTP_SENDER || process.env.SMTP_USER,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, info };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new Mailer();