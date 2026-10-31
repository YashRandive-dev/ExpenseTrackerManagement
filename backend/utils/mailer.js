const nodemailer = require("nodemailer");

let transporter;
const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
};

const TITLES = {
  verify: "Verify your email",
  reset: "Reset your password",
};

// Render's free tier blocks outbound SMTP, so production sends through a Google Apps Script
// web app (see backend/mail-relay/Code.gs) that mails from your own Gmail over HTTPS.
const sendViaRelay = async ({ to, subject, text, html }) => {
  const res = await fetch(process.env.MAIL_RELAY_URL, {
    method: "POST",
    headers: { "content-type": "text/plain" }, // text/plain avoids a CORS-style preflight on Apps Script
    body: JSON.stringify({ secret: process.env.MAIL_RELAY_SECRET, to, subject, text, html }),
    redirect: "follow",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(`Mail relay failed (${res.status}): ${data.error || "no response"}`);
};

exports.sendOtpEmail = async (to, code, purpose) => {
  const t = process.env.MAIL_RELAY_URL ? null : getTransporter();
  const title = TITLES[purpose];

  if (!t && !process.env.MAIL_RELAY_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured (set MAIL_RELAY_URL or SMTP_* env vars)");
    }
    // dev fallback: no SMTP configured, print the code to the server console
    console.log(`\n[DEV OTP] ${title} -> ${to}: ${code}\n`);
    return;
  }

  const message = {
    to,
    subject: `${title} - Expense Tracker`,
    text: `${title}\n\nYour one-time code is ${code}. It expires in 10 minutes.\nIf you didn't request this, you can ignore this email.`,
    html: `<div style="font-family:sans-serif;max-width:420px">
      <h2>${title}</h2>
      <p>Your one-time code is:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</p>
      <p style="color:#666">It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>`,
  };

  if (process.env.MAIL_RELAY_URL) return sendViaRelay(message);
  await t.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, ...message });
};
