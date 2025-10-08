export const verifyEmailTemplate = (username: string, otp: string) => ({
  subject: "🔐 Verify Your PassGen Account",
  html: `
  <div style="background-color: #0f172a; color: #f8fafc; font-family: 'Inter', sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
    
    <h2 style="color: #38bdf8; font-size: 24px; margin-bottom: 20px;">Hello ${username},</h2>

    <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0;">
      Thanks for signing up for <strong>PassGen</strong>! You’re one step away from securing your account. Use the code below to verify your email:
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <span style="display: inline-block; background: #1e293b; color: #ffffff; font-size: 28px; letter-spacing: 6px; padding: 18px 30px; border-radius: 10px; font-weight: bold; border: 2px solid #3b82f6;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #94a3b8; text-align: center;">
      This code is valid for the next <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.
    </p>

    <hr style="margin: 30px 0; border-color: #1e293b;" />

    <p style="font-size: 14px; color: #cbd5e1; text-align: center;">
      Cheers,<br/><strong>– The PassGen Team</strong>
    </p>
  </div>
  `,
});
