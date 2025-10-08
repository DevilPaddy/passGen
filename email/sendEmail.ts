import { transport } from "../email/emailConfig";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendMailOptions) => {
  try {
    const info = await transport.sendMail({
      from: `"Scribbly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};