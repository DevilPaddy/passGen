export const welcomeEmailTemplate = (username: string) => ({
  subject: "🎉 Welcome to GenPass",
  html: `
  <div style="background-color: #1e1e1e; color: #f0f0f0; font-family: 'Segoe UI', sans-serif; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
    <h2 style="color: #60a5fa;">Welcome, ${username}! 👋</h2>

    <p style="font-size: 16px; line-height: 1.5;">
      We're thrilled to have you on board! <strong>Scribbly</strong> is your personal space to capture thoughts, organize ideas, and stay productive across all your devices.
    </p>

    <div style="margin: 25px 0; text-align: center;">
      <a href="" target="_blank"
        style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-size: 16px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: 500;">
        🚀 Get Started
      </a>
    </div>

    <p style="font-size: 14px; color: #a1a1aa;">
      If you ever have questions, feedback, or need help — we’re just one click away.
    </p>

    <hr style="margin: 30px 0; border-color: #334155;" />

    <p style="font-size: 14px; color: #94a3b8;">Welcome aboard,<br/><strong>–Scribbly Team</strong></p>
  </div>
  `,
});