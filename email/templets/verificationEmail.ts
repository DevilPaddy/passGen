export const verifyEmailTemplate = (username: string, otp: string) => ({
  subject: "🔐 Verify Your Account – Scribbly",
  html: `
  <div style="background-color: #1e1e1e; color: #f0f0f0; font-family: 'Segoe UI', sans-serif; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
    <h2 style="color: #60a5fa;">Hey ${username},</h2>
    <p style="font-size: 16px; line-height: 1.5;">Thanks for signing up for <strong>Scribbly</strong>! You're one step away from getting started. Please use the code below to verify your email address:</p>
    
    <div style="margin: 30px 0; text-align: center;">
      <span style="display: inline-block; background: #0f172a; color: #ffffff; font-size: 28px; letter-spacing: 5px; padding: 15px 25px; border-radius: 8px; font-weight: bold; border: 1px solid #3b82f6;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #a1a1aa;">This code is valid for the next <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
    
    <hr style="margin: 30px 0; border-color: #334155;" />

    <p style="font-size: 14px; color: #94a3b8;">Best regards,<br/><strong>–Scribbly Team</strong></p>
  </div>
  `,
});