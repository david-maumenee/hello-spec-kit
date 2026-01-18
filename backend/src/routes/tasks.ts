import { Router, Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task-service.js';
import { createTaskSchema, updateTaskSchema } from '../utils/validation.js';
import { authMiddleware } from '../middleware/auth.js';
import { taskToApi } from '../models/task.js';

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

// GET /tasks
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const tasks = taskService.findByUserId(userId);
    res.json({ tasks: tasks.map(taskToApi) });
  })
);

// POST /tasks
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { title } = createTaskSchema.parse(req.body);
    const task = taskService.create(userId, title);
    res.status(201).json({ task: taskToApi(task) });
  })
);

// GET /tasks/:id
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const task = taskService.findById(taskId);

    if (!task || task.userId !== userId) {
      res.status(404).json({ error: 'TASK_NOT_FOUND', message: 'Task not found' });
      return;
    }

    res.json({ task: taskToApi(task) });
  })
);

// PATCH /tasks/:id
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const data = updateTaskSchema.parse(req.body);
    const task = taskService.update(taskId, userId, data);
    res.json({ task: taskToApi(task) });
  })
);

// DELETE /tasks/:id
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    taskService.delete(taskId, userId);
    res.json({ message: 'Task deleted successfully' });
  })
);

export default router;
