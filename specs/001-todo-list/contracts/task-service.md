# Task Service Contract

**Date**: 2026-01-17
**Feature**: 001-todo-list

This document defines the internal API contract for the TaskService module. Since this is a frontend-only application, these are TypeScript function signatures rather than HTTP endpoints.

## Service Interface

```typescript
// src/services/taskService.ts

interface TaskService {
  // Queries
  getAllTasks(): Task[];
  getTaskById(id: string): Task | undefined;

  // Commands
  createTask(input: CreateTaskInput): Task;
  updateTask(id: string, input: UpdateTaskInput): Task;
  deleteTask(id: string): boolean;
  toggleTaskStatus(id: string): Task;
}
```

## Operations

### getAllTasks

Retrieves all tasks from storage, ordered by creation date (newest first).

**Signature**: `getAllTasks(): Task[]`

**Returns**: Array of all tasks, empty array if none exist

**Side Effects**: None (read-only)

---

### getTaskById

Retrieves a single task by its unique identifier.

**Signature**: `getTaskById(id: string): Task | undefined`

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Task UUID |

**Returns**: Task if found, `undefined` if not found

**Side Effects**: None (read-only)

---

### createTask

Creates a new task with the given input.

**Signature**: `createTask(input: CreateTaskInput): Task`

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `input.title` | `string` | Task title (required, 1-200 chars) |
| `input.dueDate` | `string \| null` | Optional due date (YYYY-MM-DD) |

**Returns**: Newly created Task with generated `id`, `createdAt`, and `status: 'pending'`

**Throws**: `ValidationError` if title is empty or exceeds 200 characters

**Side Effects**: Persists to localStorage

---

### updateTask

Updates an existing task's title and/or due date.

**Signature**: `updateTask(id: string, input: UpdateTaskInput): Task`

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Task UUID to update |
| `input.title` | `string` | New title (optional, 1-200 chars if provided) |
| `input.dueDate` | `string \| null` | New due date or null to remove (optional) |

**Returns**: Updated Task

**Throws**:
- `NotFoundError` if task with `id` doesn't exist
- `ValidationError` if title is empty or exceeds 200 characters

**Side Effects**: Persists to localStorage

---

### deleteTask

Permanently removes a task.

**Signature**: `deleteTask(id: string): boolean`

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Task UUID to delete |

**Returns**: `true` if deleted, `false` if not found

**Side Effects**: Persists to localStorage

---

### toggleTaskStatus

Toggles a task between `pending` and `completed` status.

**Signature**: `toggleTaskStatus(id: string): Task`

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Task UUID to toggle |

**Returns**: Updated Task with toggled status

**Throws**: `NotFoundError` if task with `id` doesn't exist

**Side Effects**: Persists to localStorage

---

## Error Types

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

## Usage Examples

```typescript
import { taskService } from './services/taskService';

// Create a task
const task = taskService.createTask({
  title: 'Buy groceries',
  dueDate: '2026-01-20'
});

// Get all tasks
const tasks = taskService.getAllTasks();

// Toggle completion
const updated = taskService.toggleTaskStatus(task.id);

// Update title
const edited = taskService.updateTask(task.id, {
  title: 'Buy groceries and milk'
});

// Delete
const deleted = taskService.deleteTask(task.id);
```
