const nodemailer = require("nodemailer");
const AppError = require("../utils/AppError");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

//? Notes AND FIRST CODE
//? Create a transporter
//? Provide the provider and the auth options. For gmail you need to use less secure app option
//? Mail options contain the user who your sending to's email and the email content.
//? Send the emaiL!
// module.exports = sendEmail;

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" "[0]);
    this.url = url;
    this.from = `Admin <${process.env.EMAIL_EMAILFROM}>`;
  }
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        // To activate use gmail 'less secure app' option.
        // Sendrid and mailgun are good options.
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const HTML = pug.renderFile(
      `${__dirname}/../public/views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      HTML,
      text: htmlToText(HTML),
    };

    // 3) Create a transport and send email
    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the site.");
  }

  async sendForgotPasswordEmail() {
    await this.send("forgotPasswordEmail", "Forgot your password?");
  }
};
