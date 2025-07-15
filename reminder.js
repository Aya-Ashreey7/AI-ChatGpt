/* eslint-env node */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer transporter setup (use host instead of 'service')
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Fix SSL error
  }
});

// Send email function
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"AI Reminder" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Reminder sent to ${to}: ${text}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

// Schedule repeated reminders
function scheduleReminder(task, email) {
  const interval = 1 * 60 * 1000; // 1 minute

  console.log("⏳ Reminders will be sent every 1 minute...");

  setInterval(() => {
    const message = `Don't forget to: ${task}`;
    sendEmail(email, '🔔 Reminder!', message);
  }, interval);
}

// Start
const task = "Drink water";
const userEmail = "ayaashry68@gmail.com";
scheduleReminder(task, userEmail);
