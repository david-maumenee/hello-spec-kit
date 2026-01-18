import nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    if (process.env.NODE_ENV === 'production') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: use Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Ethereal test account:', testAccount.user);
    }

    return this.transporter;
  }

  async sendMail(options: MailOptions): Promise<void> {
    const transporter = await this.getTransporter();
    const from = process.env.EMAIL_FROM || 'noreply@todoapp.local';

    const info = await transporter.sendMail({
      from,
      ...options,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Reset Your Password - ToDo App',
      text: `You requested a password reset. Click the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}

export const emailService = new EmailService();
