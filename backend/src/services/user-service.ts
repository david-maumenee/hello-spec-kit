import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../utils/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { User, UserRow, rowToUser } from '../models/user.js';

export class UserService {
  findByEmail(email: string): User | null {
    const db = getDb();
    const row = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase()) as UserRow | undefined;

    return row ? rowToUser(row) : null;
  }

  findById(id: string): User | null {
    const db = getDb();
    const row = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;

    return row ? rowToUser(row) : null;
  }

  async create(email: string, password: string): Promise<User> {
    const db = getDb();

    const existing = this.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const id = uuidv4();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    db.prepare(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email.toLowerCase(), passwordHash, now, now);

    const user = this.findById(id);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return comparePassword(password, user.passwordHash);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const db = getDb();
    const passwordHash = await hashPassword(newPassword);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
      passwordHash,
      userId
    );
  }

  delete(userId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  }
}

export const userService = new UserService();
