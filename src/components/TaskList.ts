import type { Task } from '../models/task';
import { renderTaskItem, type TaskItemCallbacks } from './TaskItem';

export interface TaskListCallbacks {
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function renderTaskList(
  tasks: Task[],
  container: HTMLElement,
  callbacks: TaskListCallbacks = {}
): void {
  container.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'task-list__empty';
    emptyState.innerHTML = `
      <div class="task-list__empty-icon">📝</div>
      <p>No tasks yet!</p>
      <p>Add your first task to get started.</p>
    `;
    container.appendChild(emptyState);
    return;
  }

  const list = document.createElement('div');
  list.className = 'task-list';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', 'Task list');

  const itemCallbacks: TaskItemCallbacks = {
    onToggle: callbacks.onToggle,
    onDelete: callbacks.onDelete,
    onEdit: callbacks.onEdit,
  };

  for (const task of tasks) {
    const taskItem = renderTaskItem(task, itemCallbacks);
    list.appendChild(taskItem);
  }

  container.appendChild(list);
}
