const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // eslint-disable-line no-undef
    pass: process.env.EMAIL_PASSWORD, // eslint-disable-line no-undef
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // eslint-disable-line no-undef
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
