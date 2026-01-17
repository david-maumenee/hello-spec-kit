export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  dueDate?: string | null;
}
