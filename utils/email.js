const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  console.log(options.to);
  const mailOptions = {
    from: "Ahmed Makhlouf <ahmedam.official@gmail.com>",
    to: options.to,
    replyTo: "ahmedam.official@gmail.com",
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
