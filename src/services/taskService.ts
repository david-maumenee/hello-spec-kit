import type { Task, CreateTaskInput, UpdateTaskInput } from '../models/task';
import { ValidationError, NotFoundError } from './errors';
import { loadTasks, saveTasks } from './storage';

function validateTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new ValidationError('Title is required');
  }
  if (trimmed.length > 200) {
    throw new ValidationError('Title must be 200 characters or less');
  }
  return trimmed;
}

export function createTask(input: CreateTaskInput): Task {
  const title = validateTitle(input.title);

  const task: Task = {
    id: crypto.randomUUID(),
    title,
    status: 'pending',
    dueDate: input.dueDate ?? null,
    createdAt: new Date().toISOString(),
  };

  const tasks = loadTasks();
  tasks.unshift(task);
  saveTasks(tasks);

  return task;
}

export function getAllTasks(): Task[] {
  const tasks = loadTasks();
  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTaskById(id: string): Task | undefined {
  const tasks = loadTasks();
  return tasks.find((t) => t.id === id);
}

export function updateTask(id: string, input: UpdateTaskInput): Task {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new NotFoundError(`Task with id "${id}" not found`);
  }

  const task = tasks[taskIndex];

  if (input.title !== undefined) {
    task.title = validateTitle(input.title);
  }

  if (input.dueDate !== undefined) {
    task.dueDate = input.dueDate;
  }

  saveTasks(tasks);

  return task;
}

export function toggleTaskStatus(id: string): Task {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    throw new NotFoundError(`Task with id "${id}" not found`);
  }

  const task = tasks[taskIndex];
  task.status = task.status === 'pending' ? 'completed' : 'pending';
  saveTasks(tasks);

  return task;
}

export function deleteTask(id: string): boolean {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  return true;
}
