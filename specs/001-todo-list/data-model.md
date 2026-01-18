# Data Model: ToDo List Manager

**Date**: 2026-01-17
**Feature**: 001-todo-list

## Entities

### Task

A unit of work to be tracked by the user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (UUID v4) |
| `title` | `string` | Yes | Task description (1-200 characters) |
| `status` | `TaskStatus` | Yes | Current state of the task |
| `dueDate` | `string \| null` | No | Due date in ISO format (YYYY-MM-DD) |
| `createdAt` | `string` | Yes | Creation timestamp (ISO 8601) |

### TaskStatus (Enum)

| Value | Description |
|-------|-------------|
| `pending` | Task is not yet completed |
| `completed` | Task has been marked as done |

## TypeScript Definitions

```typescript
// src/models/task.ts

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
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, non-empty | "Title is required" |
| `title` | Max 200 characters | "Title must be 200 characters or less" |
| `title` | Trimmed (no leading/trailing whitespace) | N/A (auto-trimmed) |
| `dueDate` | Valid ISO date format if provided | "Invalid date format" |
| `dueDate` | Can be past, present, or future | N/A (all dates allowed) |

## State Transitions

```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────────┐         ┌───────────┐   │
│    │ pending │ ──────► │ completed │   │
│    └─────────┘         └───────────┘   │
│         ▲                    │          │
│         │                    │          │
│         └────────────────────┘          │
│                                         │
│         (toggle on user action)         │
└─────────────────────────────────────────┘
```

- **Initial State**: All new tasks start as `pending`
- **Toggle**: User can switch between `pending` ↔ `completed` freely
- **No terminal state**: Tasks can always be toggled back

## Storage Schema

Tasks are stored as a JSON array in localStorage:

```json
{
  "key": "todo-tasks",
  "value": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "status": "pending",
      "dueDate": "2026-01-20",
      "createdAt": "2026-01-17T10:30:00.000Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "title": "Call dentist",
      "status": "completed",
      "dueDate": null,
      "createdAt": "2026-01-16T09:00:00.000Z"
    }
  ]
}
```

## Derived Properties (Computed at Runtime)

| Property | Computation | Usage |
|----------|-------------|-------|
| `isOverdue` | `dueDate < today && status === 'pending'` | Visual highlighting |
| `displayDate` | `Intl.DateTimeFormat` on `dueDate` | UI display |

## Ordering

Tasks are displayed in **creation order, newest first** (descending by `createdAt`).

## Data Integrity

- **ID Uniqueness**: Guaranteed by `crypto.randomUUID()`
- **No orphans**: Tasks exist only in the single array (no relationships)
- **Atomic updates**: Entire array replaced on each write
- **No cascade**: Delete removes single task, no side effects
