import type { Task, CreateTaskInput, UpdateTaskInput } from '../models/task';

export interface TaskFormCallbacks {
  onSubmit: (input: CreateTaskInput) => void;
  onUpdate?: (id: string, input: UpdateTaskInput) => void;
  onCancel?: () => void;
}

export interface TaskFormState {
  editingTask: Task | null;
}

const formState: TaskFormState = {
  editingTask: null,
};

export function setEditingTask(task: Task | null): void {
  formState.editingTask = task;
}

export function getEditingTask(): Task | null {
  return formState.editingTask;
}

export function renderTaskForm(container: HTMLElement, callbacks: TaskFormCallbacks): void {
  const form = document.createElement('form');
  form.className = 'task-form';
  form.setAttribute('aria-label', 'Task form');

  const isEditing = formState.editingTask !== null;
  if (isEditing) {
    form.classList.add('task-form--editing');
  }
  const task = formState.editingTask;

  form.innerHTML = `
    <div class="task-form__group">
      <label class="task-form__label" for="task-title">Task Title</label>
      <input
        type="text"
        id="task-title"
        class="task-form__input"
        placeholder="What needs to be done?"
        maxlength="200"
        value="${task?.title ?? ''}"
        required
      />
      <div class="task-form__error" id="title-error" role="alert"></div>
    </div>
    <div class="task-form__group">
      <label class="task-form__label" for="task-due-date">Due Date (optional)</label>
      <input
        type="date"
        id="task-due-date"
        class="task-form__input"
        value="${task?.dueDate ?? ''}"
      />
    </div>
    <div class="task-form__actions">
      <button type="submit" class="btn btn--primary">${isEditing ? 'Update Task' : 'Add Task'}</button>
      ${isEditing ? '<button type="button" class="btn btn--secondary" id="cancel-edit">Cancel</button>' : ''}
    </div>
  `;

  const titleInput = form.querySelector<HTMLInputElement>('#task-title');
  const dueDateInput = form.querySelector<HTMLInputElement>('#task-due-date');
  const errorDisplay = form.querySelector<HTMLDivElement>('#title-error');
  const cancelBtn = form.querySelector<HTMLButtonElement>('#cancel-edit');

  if (!titleInput || !dueDateInput || !errorDisplay) {
    return;
  }

  if (cancelBtn && callbacks.onCancel) {
    cancelBtn.addEventListener('click', () => {
      formState.editingTask = null;
      callbacks.onCancel?.();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDisplay.textContent = '';

    const title = titleInput.value.trim();
    if (!title) {
      errorDisplay.textContent = 'Title is required';
      titleInput.focus();
      return;
    }

    try {
      const dueDate = dueDateInput.value || null;

      if (isEditing && task && callbacks.onUpdate) {
        callbacks.onUpdate(task.id, { title, dueDate });
        formState.editingTask = null;
      } else {
        callbacks.onSubmit({ title, dueDate });
      }

      titleInput.value = '';
      dueDateInput.value = '';
      titleInput.focus();
    } catch (error) {
      if (error instanceof Error) {
        errorDisplay.textContent = error.message;
      }
    }
  });

  container.innerHTML = '';
  container.appendChild(form);

  if (isEditing) {
    titleInput.focus();
    titleInput.select();
  }
}
