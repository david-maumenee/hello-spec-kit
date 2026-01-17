import type { Task } from '../models/task';
import { formatDate, isOverdue } from '../utils/dateUtils';

export interface TaskItemCallbacks {
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function renderTaskItem(task: Task, callbacks: TaskItemCallbacks = {}): HTMLElement {
  const item = document.createElement('div');
  item.className = 'task-item';
  item.setAttribute('role', 'listitem');
  if (task.status === 'completed') {
    item.classList.add('task-item--completed');
  }
  if (isOverdue(task)) {
    item.classList.add('task-item--overdue');
  }
  item.dataset.taskId = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-item__checkbox';
  checkbox.checked = task.status === 'completed';
  checkbox.setAttribute(
    'aria-label',
    `Mark "${task.title}" as ${task.status === 'completed' ? 'pending' : 'completed'}`
  );

  if (callbacks.onToggle) {
    checkbox.addEventListener('change', () => {
      callbacks.onToggle?.(task.id);
    });
  }

  const content = document.createElement('div');
  content.className = 'task-item__content';

  const title = document.createElement('div');
  title.className = 'task-item__title';
  title.textContent = task.title;

  const meta = document.createElement('div');
  meta.className = 'task-item__meta';

  if (task.dueDate) {
    const dueDate = document.createElement('span');
    dueDate.className = 'task-item__due-date';
    if (isOverdue(task)) {
      dueDate.classList.add('task-item__due-date--overdue');
    }
    dueDate.textContent = `📅 ${formatDate(task.dueDate)}`;
    meta.appendChild(dueDate);
  }

  content.appendChild(title);
  content.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-item__actions';

  if (callbacks.onEdit) {
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn--icon';
    editBtn.innerHTML = '✏️';
    editBtn.setAttribute('aria-label', `Edit "${task.title}"`);
    editBtn.addEventListener('click', () => {
      callbacks.onEdit?.(task.id);
    });
    actions.appendChild(editBtn);
  }

  if (callbacks.onDelete) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn--icon';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', `Delete "${task.title}"`);
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Delete task "${task.title}"?`)) {
        callbacks.onDelete?.(task.id);
      }
    });
    actions.appendChild(deleteBtn);
  }

  item.appendChild(checkbox);
  item.appendChild(content);
  item.appendChild(actions);

  return item;
}
