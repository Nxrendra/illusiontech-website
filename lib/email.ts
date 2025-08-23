import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
  } = process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    console.warn("Email server environment variables are not fully configured. Email sending will be disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    secure: Number(EMAIL_SERVER_PORT) === 465,
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });
  return transporter;
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * A generic function to send an email.
 * @param {MailOptions} mailOptions - The options for the email.
 */
export async function sendEmail({ to, subject, html, text }: MailOptions) {
  const mailer = getTransporter();
  const fromEmail = process.env.EMAIL_FROM;

  if (!mailer || !fromEmail) {
    console.log('Email not sent: Email service is not configured.');
    return;
  }

  const options = {
    from: `"Illusion Tech" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  };

  try {
    await mailer.sendMail(options);
    console.log(`Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error('Failed to send email.');
  }
}

interface BroadcastMailOptions {
  recipientEmails: string[];
  subject: string;
  html: string;
  text: string;
}

/**
 * Sends a broadcast email to multiple recipients using BCC for privacy.
 * @param {BroadcastMailOptions} mailOptions - The options for the broadcast email.
 */
export async function sendBroadcastEmail({ recipientEmails, subject, html, text }: BroadcastMailOptions) {
  const mailer = getTransporter();
  const fromEmail = process.env.EMAIL_FROM;

  if (!mailer || !fromEmail) {
    console.error('Email not sent: Email service is not configured.');
    throw new Error('Email service is not configured on the server.');
  }

  const options = {
    from: `"Illusion Tech" <${fromEmail}>`,
    to: fromEmail, // Send to self
    bcc: recipientEmails, // And BCC all subscribers for privacy
    subject,
    html,
    text,
  };

  await mailer.sendMail(options);
  console.log(`Broadcast email with subject "${subject}" sent to ${recipientEmails.length} recipients.`);
}

/**
 * Sends a welcome email to a new newsletter subscriber.
 * @param {string} toEmail - The email address of the new subscriber.
 */
export async function sendWelcomeEmail(toEmail: string) {
  const subject = 'Welcome to the Illusion Tech Newsletter! 🎉';
  const html = `<div style="font-family: sans-serif; line-height: 1.6;"><h2>Welcome!</h2><p>Thank you for subscribing to the Illusion Tech newsletter.</p></div>`;
  const text = `Welcome! Thank you for subscribing to the Illusion Tech newsletter.`;

  return sendEmail({ to: toEmail, subject, html, text });
}
