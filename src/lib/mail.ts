import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: 'Pierre AI <canadacontrabajo@resend.dev>', // Should be updated to custom domain in production
      to: email,
      subject: 'Restablecer tu contraseña - Pierre PRO',
      html: `
        <div style="font-family: sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto;">
          <h1 style="color: #fbbf24; font-size: 24px; margin-bottom: 20px;">Pierre <span style="font-style: italic;">PRO</span></h1>
          <p style="font-size: 16px; line-height: 1.6;">Hola,</p>
          <p style="font-size: 16px; line-height: 1.6;">Has solicitado restablecer tu contraseña para acceder al Portal de Estrategia de Pierre PRO.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #fbbf24; color: #0f172a; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;"> Restablecer Contraseña </a>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
          </p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw error;
  }
};
