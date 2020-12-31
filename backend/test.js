require('dotenv').config();
const { sendEmail } = require('./startup/mail');

const ctx = {
  title: 'Jayonta invited you to join testteam026',
  link: 'https://www.google.com',
};

sendEmail(
  'jayonta@example.com',
  'Jayonta invited you to join testteam026',
  'sendInvitation',
  ctx
);
