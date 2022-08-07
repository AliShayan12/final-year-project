const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        service: process.env.E_SERVICE,
        auth: {
            user: process.env.S_EMAIL,
            pass: process.env.S_PASSWORD,
        }
    })
    const mailOptions = {
        from: process.env.S_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;