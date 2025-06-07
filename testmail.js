// testMail.js
const sendMail = require('./utils/sendMail');

sendMail(
  'Test Email from AounGarage',
  'This is a test email to confirm SMTP setup.',
  '<p><strong>This is a test email from AounGarage.</strong></p>'
);
