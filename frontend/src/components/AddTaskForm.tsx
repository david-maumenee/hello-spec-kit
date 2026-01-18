import { useState, FormEvent } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(undefined);
    setIsLoading(true);

    try {
      await onAdd(title.trim());
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      {error && <div className="error-message">{error}</div>}
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
          maxLength={500}
        />
        <button type="submit" disabled={isLoading || !title.trim()} className="btn-primary">
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}
