require('dotenv').config();
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

console.log('Testing Email Configuration...');
console.log('User:', emailUser);
console.log('Pass Length:', emailPass ? emailPass.length : 'undefined');

// Mask the password for display
const maskedPass = emailPass ? emailPass.substring(0, 2) + '*'.repeat(emailPass.length - 4) + emailPass.substring(emailPass.length - 2) : 'NONE';
console.log('Pass:', maskedPass);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

const mailOptions = {
    from: emailUser,
    to: emailUser, // Send to self
    subject: 'Test Email from Node Script',
    text: 'If you receive this, your App Password is working!'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
