const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // eslint-disable-line no-undef
    pass: process.env.EMAIL_PASSWORD, // eslint-disable-line no-undef
  },
  debug: true,
  logger: true,
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // eslint-disable-line no-undef
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendMail };
