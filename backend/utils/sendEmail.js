const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const destination = to || process.env.EMAIL_TO || user;

  if (!user || !pass) {
    throw new Error("Email credentials not configured");
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: { user, pass },
  });

  return transporter.sendMail({
    from: user,
    to: destination,
    subject,
    text,
  });
};

module.exports = sendEmail;
