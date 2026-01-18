import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../utils/db.js';
import { generateToken, hashToken } from '../utils/token.js';
import { RefreshToken, RefreshTokenRow, rowToRefreshToken } from '../models/refresh-token.js';

export class RefreshTokenService {
  create(userId: string, expiryMs: number): string {
    const db = getDb();
    const token = generateToken();
    const tokenHash = hashToken(token);
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + expiryMs).toISOString();
    const createdAt = new Date().toISOString();

    db.prepare(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, userId, tokenHash, expiresAt, createdAt);

    return token;
  }

  validate(token: string): RefreshToken | null {
    const db = getDb();
    const tokenHash = hashToken(token);
    const now = new Date().toISOString();

    const row = db
      .prepare(
        'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > ?'
      )
      .get(tokenHash, now) as RefreshTokenRow | undefined;

    return row ? rowToRefreshToken(row) : null;
  }

  invalidate(token: string): void {
    const db = getDb();
    const tokenHash = hashToken(token);
    db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(tokenHash);
  }

  invalidateAllForUser(userId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
  }
}

export const refreshTokenService = new RefreshTokenService();
