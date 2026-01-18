import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../utils/db.js';
import { generateToken, hashToken } from '../utils/token.js';
import { userService } from './user-service.js';
import { refreshTokenService } from './refresh-token-service.js';
import { emailService } from './email-service.js';
import { AppError } from '../middleware/error.js';
import {
  PasswordResetToken,
  PasswordResetTokenRow,
  rowToPasswordResetToken,
} from '../models/password-reset-token.js';

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export class PasswordResetService {
  async createToken(userId: string): Promise<string> {
    const db = getDb();
    const now = new Date().toISOString();

    // Invalidate any existing tokens for this user
    db.prepare(
      'UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL'
    ).run(now, userId);

    const token = generateToken();
    const tokenHash = hashToken(token);
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();

    db.prepare(
      'INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, userId, tokenHash, expiresAt, now);

    return token;
  }

  validateToken(token: string): PasswordResetToken | null {
    const db = getDb();
    const tokenHash = hashToken(token);
    const now = new Date().toISOString();

    const row = db
      .prepare(
        'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?'
      )
      .get(tokenHash, now) as PasswordResetTokenRow | undefined;

    return row ? rowToPasswordResetToken(row) : null;
  }

  async requestReset(email: string): Promise<void> {
    const user = userService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const token = await this.createToken(user.id);
    await emailService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenData = this.validateToken(token);
    if (!tokenData) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid or expired reset token');
    }

    const db = getDb();
    const now = new Date().toISOString();

    // Mark token as used
    db.prepare(
      'UPDATE password_reset_tokens SET used_at = ? WHERE id = ?'
    ).run(now, tokenData.id);

    // Update password
    await userService.updatePassword(tokenData.userId, newPassword);

    // Invalidate all refresh tokens (log user out everywhere)
    refreshTokenService.invalidateAllForUser(tokenData.userId);
  }
}

export const passwordResetService = new PasswordResetService();
