import './styles/main.css';
import { createTask, getAllTasks, toggleTaskStatus, deleteTask, updateTask, getTaskById } from './services/taskService';
import { renderTaskForm, setEditingTask } from './components/TaskForm';
import { renderTaskList } from './components/TaskList';

function initApp(): void {
  const formContainer = document.getElementById('task-form-container');
  const listContainer = document.getElementById('task-list-container');

  if (!formContainer || !listContainer) {
    console.error('Required DOM containers not found');
    return;
  }

  const form = formContainer;
  const list = listContainer;

  function refreshForm(): void {
    renderTaskForm(form, {
      onSubmit: (input) => {
        createTask(input);
        refreshTaskList();
      },
      onUpdate: (id, input) => {
        updateTask(id, input);
        refreshForm();
        refreshTaskList();
      },
      onCancel: () => {
        refreshForm();
      },
    });
  }

  function refreshTaskList(): void {
    const tasks = getAllTasks();
    renderTaskList(tasks, list, {
      onToggle: (id) => {
        toggleTaskStatus(id);
        refreshTaskList();
      },
      onDelete: (id) => {
        deleteTask(id);
        refreshTaskList();
      },
      onEdit: (id) => {
        const task = getTaskById(id);
        if (task) {
          setEditingTask(task);
          refreshForm();
        }
      },
    });
  }

  refreshForm();

  refreshTaskList();
}

document.addEventListener('DOMContentLoaded', initApp);
