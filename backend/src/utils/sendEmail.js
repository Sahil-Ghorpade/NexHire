import "../config/env.js";

/**
 * Send email using Brevo API
 * (Render-friendly, no SMTP required)
 */
const sendEmail = async (
  to,
  subject,
  htmlContent
) => {
  const response =
    await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          "api-key":
            process.env.BREVO_API_KEY,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: "NexHire",
            email:
              process.env.GMAIL_USER,
          },

          to: [
            {
              email: to,
            },
          ],

          subject,

          htmlContent,
        }),
      }
    );

  if (!response.ok) {
    let errorData = {};

    try {
      errorData =
        await response.json();
    } catch {
      errorData = {};
    }

    throw new Error(
      `Failed to send email: ${
        errorData.message ||
        response.statusText
      }`
    );
  }

  return await response.json();
};

export default sendEmail;