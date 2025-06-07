// utils/sendMail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Transporter error:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});


/**
 * Sends an email to the admin
 * @param {string} subject - Subject of the email
 * @param {string} text - Plain text body
 * @param {string} html - Optional HTML content
 */
async function sendMail(subject, text, html = null) {
  try {
    const info = await transporter.sendMail({
      from: `"AounGarage" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self (admin)
      subject,
      text,
      html
    });
    console.log('📬 Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
}

module.exports = sendMail;
