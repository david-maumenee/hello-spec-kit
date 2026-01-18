import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user-service.js';
import { deleteAccountSchema } from '../utils/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { userToPublic } from '../models/user.js';
import { AppError } from '../middleware/error.js';

const router = Router();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// All routes require authentication
router.use(authMiddleware);

// GET /account
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const user = userService.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found' });
      return;
    }
    res.json({ user: userToPublic(user) });
  })
);

// DELETE /account
router.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { password } = deleteAccountSchema.parse(req.body);

    const user = userService.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    const validPassword = await userService.verifyPassword(user, password);
    if (!validPassword) {
      throw new AppError(401, 'INVALID_PASSWORD', 'Invalid password');
    }

    // Delete user (cascade will handle tasks, tokens, etc.)
    userService.delete(userId);

    res.json({ message: 'Account deleted successfully' });
  })
);

export default router;
