import nodemailer from 'nodemailer'
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: `${process.env.SMTP_HOST}`,
    port: process.env.SMTP_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: `${process.env.SMTP_USERNAME}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });
  const message = {
    from: `${process.env.SMTP_FROMNAME}  <${process.env.SMTP_FROMEMAIL}>`, // sender address
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail