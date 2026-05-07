const RESEND_API_URL = 'https://api.resend.com/emails';
let emailClient = null;

const initEmailService = async () => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      console.warn('⚠️  Resend email service not configured, skipping email initialization');
      emailClient = null;
      return null;
    }

    emailClient = {
      apiKey,
      from,
    };
    console.log('✓ Email service configured (Resend)');
    return emailClient;
  } catch (error) {
    console.error('✗ Email service configuration failed:', error.message);
    return null;
  }
};

const getEmailTransporter = () => emailClient;

// Pure function to send email
const sendEmail = async (mailOptions) => {
  try {
    if (!emailClient) {
      console.warn('⚠️  Email service not initialized, skipping email');
      return null;
    }

    const payload = {
      from: mailOptions.from || emailClient.from,
      to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
      reply_to: mailOptions.replyTo,
    };

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${emailClient.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error: ${response.status} ${errorBody}`);
    }

    const info = await response.json();
    console.log('✓ Email sent:', info.id);
    return info;
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    return null;
  }
};

module.exports = { initEmailService, getEmailTransporter, sendEmail };
