const nodemailer = require('nodemailer');

let transporter = null;

const initEmailService = async () => {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✓ Email service configured');
    return transporter;
  } catch (error) {
    console.error('✗ Email service configuration failed:', error.message);
    return null;
  }
};

const getEmailTransporter = () => transporter;

// Pure function to send email
const sendEmail = async (mailOptions) => {
  try {
    if (!transporter) {
      console.warn('⚠️  Email service not initialized, skipping email');
      return null;
    }
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    return null;
  }
};

module.exports = { initEmailService, getEmailTransporter, sendEmail };
