import "../config/env.js";
import nodemailer from "nodemailer";

/**
 * Gmail SMTP Transporter
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send Email Utility
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"NexHire" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("SMTP Error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;