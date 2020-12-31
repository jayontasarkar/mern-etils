const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const options = {
  viewEngine: {
    layoutsDir: __dirname + '/../emails/layouts',
    extname: '.hbs',
  },
  extName: '.hbs',
  viewPath: __dirname + '/../emails',
};

transporter.use('compile', hbs(options));

const sendEmail = async (to, subject, template, context, attachments) => {
  return await transporter.sendMail({
    to,
    from: `ETILS <${process.env.FROM_EMAIL}`,
    subject,
    template,
    context,
    attachments,
  });
};

exports.sendEmail = sendEmail;
