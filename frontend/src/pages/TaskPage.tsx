import { useState, useEffect } from 'react';
import { TaskList } from '../components/TaskList';
import { AddTaskForm } from '../components/AddTaskForm';
import { Header } from '../components/Header';
import { Task, api } from '../services/api';

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

export function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get<TasksResponse>('/tasks');
      setTasks(response.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    const response = await api.post<TaskResponse>('/tasks', { title });
    setTasks([response.task, ...tasks]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const response = await api.patch<TaskResponse>(`/tasks/${id}`, { completed });
    setTasks(tasks.map((t) => (t.id === id ? response.task : t)));
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <h1>My Tasks</h1>
        <AddTaskForm onAdd={handleAddTask} />
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
