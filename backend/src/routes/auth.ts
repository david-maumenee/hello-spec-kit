import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth-service.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation.js';
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
} from '../middleware/rate-limit.js';
import { authMiddleware } from '../middleware/auth.js';
import { passwordResetService } from '../services/password-reset-service.js';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// POST /auth/register
router.post(
  '/register',
  registerRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = registerSchema.parse(req.body);
    const result = await authService.register(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  })
);

// POST /auth/login
router.post(
  '/login',
  loginRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = loginSchema.parse(req.body);
    const result = await authService.login(email, password, rememberMe);

    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 24 hours

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge,
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  })
);

// POST /auth/refresh
router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({
        error: 'NO_REFRESH_TOKEN',
        message: 'No refresh token provided',
      });
      return;
    }

    const result = await authService.refresh(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  })
);

// POST /auth/logout
router.post(
  '/logout',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully' });
  })
);

// POST /auth/forgot-password
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Always return success to prevent email enumeration
    try {
      await passwordResetService.requestReset(email);
    } catch {
      // Silently ignore errors to prevent email enumeration
    }

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  })
);

// POST /auth/reset-password
router.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await passwordResetService.resetPassword(token, password);

    res.json({ message: 'Password reset successfully' });
  })
);

export default router;
