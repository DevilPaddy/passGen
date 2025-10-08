export const welcomeEmailTemplate = (username: string) => ({
  subject: "🎉 Welcome to PassGen!",
  html: `
  <div style="background-color: #0f172a; color: #f8fafc; font-family: 'Inter', sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
    
    <h2 style="color: #38bdf8; font-size: 24px; margin-bottom: 20px;">Welcome, ${username}! 👋</h2>

    <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0;">
      You’re now part of <strong>PassGen</strong> — your personal and secure password generator. Start creating strong passwords and manage them safely across all your devices.
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="" target="_blank"
        style="background: linear-gradient(90deg, #3b82f6, #06b6d4); color: #ffffff; padding: 14px 28px; font-size: 16px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease;">
        🚀 Get Started
      </a>
    </div>

    <p style="font-size: 14px; color: #94a3b8; text-align: center;">
      Need help or have feedback? Reach out anytime — we’re here for you.
    </p>

    <hr style="margin: 30px 0; border-color: #1e293b;" />

    <p style="font-size: 14px; color: #cbd5e1; text-align: center;">
      Cheers,<br/><strong>– The PassGen Team</strong>
    </p>
  </div>
  `,
});
