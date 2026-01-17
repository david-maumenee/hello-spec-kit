import type { Task } from '../models/task';

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(isoDate));
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }
  const today = getTodayISO();
  return task.dueDate < today;
}
