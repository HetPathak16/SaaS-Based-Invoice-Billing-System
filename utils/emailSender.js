let nodemailer = require("nodemailer");

exports.sendEmailWithAttachment = async ({ to, subject, text, attachmentPath }) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jasper21@ethereal.email',
            pass: 'KBG1tX2G2wYFxr7Xf9'
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: attachmentPath ? [{ path: attachmentPath }] : [],
    };

    await transporter.sendMail(mailOptions);
};
