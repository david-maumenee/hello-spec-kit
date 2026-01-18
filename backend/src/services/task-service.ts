import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../utils/db.js';
import { Task, TaskRow, rowToTask } from '../models/task.js';
import { AppError } from '../middleware/error.js';

export class TaskService {
  findByUserId(userId: string): Task[] {
    const db = getDb();
    const rows = db
      .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as TaskRow[];

    return rows.map(rowToTask);
  }

  findById(id: string): Task | null {
    const db = getDb();
    const row = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get(id) as TaskRow | undefined;

    return row ? rowToTask(row) : null;
  }

  create(userId: string, title: string): Task {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(
      'INSERT INTO tasks (id, user_id, title, completed, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)'
    ).run(id, userId, title, now, now);

    const task = this.findById(id);
    if (!task) {
      throw new Error('Failed to create task');
    }

    return task;
  }

  update(id: string, userId: string, data: { title?: string; completed?: boolean }): Task {
    const db = getDb();
    const existing = this.findById(id);

    if (!existing) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    if (existing.userId !== userId) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.completed !== undefined) {
      updates.push('completed = ?');
      values.push(data.completed ? 1 : 0);
    }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = this.findById(id);
    if (!updated) {
      throw new Error('Failed to update task');
    }

    return updated;
  }

  delete(id: string, userId: string): void {
    const db = getDb();
    const existing = this.findById(id);

    if (!existing) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    if (existing.userId !== userId) {
      throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  }
}

export const taskService = new TaskService();
