import nodemailer from "nodemailer";

/**
 * Send an email using SMTP credentials from environment variables.
 * Required env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Falls back to Ethereal (fake SMTP for dev) if no SMTP_HOST is set.
 */

let _transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    _transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    // Dev fallback: Ethereal fake SMTP — logs preview URL to console
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log("[Mailer] Using Ethereal test account:", testAccount.user);
  }

  return _transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const transporter = await getTransporter();
  const from = process.env.SMTP_FROM ?? "Vistara Play <noreply@vistaraplay.com>";

  const info = await transporter.sendMail({ from, to, subject, html, text });

  // In dev, log the Ethereal preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("[Mailer] Preview URL:", previewUrl);
  }

  return info;
}
