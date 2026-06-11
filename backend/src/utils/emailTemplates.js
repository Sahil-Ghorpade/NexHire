/**
 * OTP Email Template
 */
export const otpEmailTemplate = (otp, purpose) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>NexHire OTP</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
        
        <div style="background:#0f172a;padding:20px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
            NexHire
          </h1>
        </div>

        <div style="padding:30px;">
          <p style="font-size:16px;color:#333;">
            Here is your OTP to <strong>${purpose}</strong>:
          </p>

          <div
            style="
              margin:30px 0;
              padding:20px;
              text-align:center;
              background:#f8fafc;
              border:2px dashed #0f172a;
              border-radius:8px;
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#0f172a;
            "
          >
            ${otp}
          </div>

          <p style="color:#555;font-size:15px;">
            This code expires in <strong>10 minutes</strong>.
          </p>

          <p style="margin-top:30px;color:#777;font-size:14px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Password Reset Success Template
 */
export const resetSuccessEmailTemplate = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Updated</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
        
        <div style="background:#0f172a;padding:20px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
            NexHire
          </h1>
        </div>

        <div style="padding:30px;">
          <h2 style="color:#111827;">
            Password Successfully Updated
          </h2>

          <p style="font-size:16px;color:#333;">
            Your NexHire password has been successfully updated.
          </p>

          <p style="margin-top:30px;color:#777;font-size:14px;">
            If you didn't make this change, contact support immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};