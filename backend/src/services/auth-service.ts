import { userService } from './user-service.js';
import { refreshTokenService } from './refresh-token-service.js';
import { signAccessToken } from '../utils/jwt.js';
import { User, userToPublic, UserPublic } from '../models/user.js';
import { AppError } from '../middleware/error.js';

const JWT_REFRESH_EXPIRY_STANDARD = process.env.JWT_REFRESH_EXPIRY_STANDARD || '24h';
const JWT_REFRESH_EXPIRY_REMEMBER = process.env.JWT_REFRESH_EXPIRY_REMEMBER || '30d';

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([hdm])$/);
  if (!match) return 24 * 60 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'm':
      return value * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: UserPublic;
}

export class AuthService {
  async register(email: string, password: string): Promise<AuthResult> {
    const existing = userService.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    const user = await userService.create(email, password);
    return this.createSession(user, false);
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> {
    const user = userService.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const validPassword = await userService.verifyPassword(user, password);
    if (!validPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    return this.createSession(user, rememberMe);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const tokenData = refreshTokenService.validate(refreshToken);
    if (!tokenData) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token');
    }

    const user = userService.findById(tokenData.userId);
    if (!user) {
      throw new AppError(401, 'USER_NOT_FOUND', 'User not found');
    }

    // Invalidate old token and create new session (token rotation)
    refreshTokenService.invalidate(refreshToken);

    // Determine if this was a "remember me" session
    const expiresAt = new Date(tokenData.expiresAt).getTime();
    const now = Date.now();
    const remainingMs = expiresAt - now;
    const standardExpiryMs = parseExpiry(JWT_REFRESH_EXPIRY_STANDARD);
    const rememberMe = remainingMs > standardExpiryMs;

    return this.createSession(user, rememberMe);
  }

  async logout(refreshToken: string): Promise<void> {
    refreshTokenService.invalidate(refreshToken);
  }

  private async createSession(user: User, rememberMe: boolean): Promise<AuthResult> {
    const accessToken = signAccessToken({ userId: user.id, email: user.email });

    const expiryMs = rememberMe
      ? parseExpiry(JWT_REFRESH_EXPIRY_REMEMBER)
      : parseExpiry(JWT_REFRESH_EXPIRY_STANDARD);

    const refreshToken = refreshTokenService.create(user.id, expiryMs);

    return {
      accessToken,
      refreshToken,
      user: userToPublic(user),
    };
  }
}

export const authService = new AuthService();
