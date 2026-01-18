import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-min-32-chars';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
