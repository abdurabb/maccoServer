const nodemailer = require('nodemailer');
const path = require('path');
// const hbs = require("nodemailer-express-handlebars");

const templatePath = path.join(__dirname, '..', 'templates');

const createTransporter = async () => {
    const hbs = (await import('nodemailer-express-handlebars')).default;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        }
    });

    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: templatePath,
            defaultLayout: false,
        },
        viewPath: templatePath,
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    return transporter;
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// --------------
const sendMail = async (to) => {
    const transporter = await createTransporter();
    if (!isValidEmail(to)) {
        throw new InvalidEmailError(to);
    }
    const otpCode = generateOTP();
    try {
        const mailOptions = {
            // from: 'Sophwe Food <artefinoproject@gmail.com>',
            from: 'Adam Clinic App <artefinoproject@gmail.com>',
            to: to,
            subject: 'OTP Verification',
            template: 'otp-verification',
            context: {
                otpCode: otpCode,
                expirationTime: 3,
                logo: "https://res.cloudinary.com/fouvtycloud/image/upload/v1732873616/my_folder/zlbzjztaii79nfkjjq6n.jpg"
            }
        };
        const result = await transporter.sendMail(mailOptions);
        return { success: true, status: true, otpCode };
    } catch (error) {

        throw new EmailSendError('Failed to send email', error);
    }
};


// Email validation and error handling
class EmailSendError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'EmailSendError';
        this.originalError = originalError;
    }
}

class InvalidEmailError extends Error {
    constructor(email) {
        super(`Invalid email address: ${email}`);
        this.name = 'InvalidEmailError';
    }
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    sendMail,
    EmailSendError,
    InvalidEmailError,
};
