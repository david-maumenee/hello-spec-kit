# Research: ToDo List Manager

**Date**: 2026-01-17
**Feature**: 001-todo-list

## Research Questions

### 1. Frontend Build Tooling for Vanilla TypeScript

**Decision**: Vite

**Rationale**: Vite provides fast development server with hot module replacement, native TypeScript support without additional configuration, and simple production builds. It's lightweight and doesn't impose framework opinions.

**Alternatives Considered**:
- **Webpack**: More configuration overhead, slower dev server. Rejected per Simplicity First.
- **esbuild directly**: Faster but requires manual dev server setup. Vite uses esbuild under the hood with better DX.
- **Parcel**: Zero-config but less community adoption and TypeScript support than Vite.
- **No bundler (tsc only)**: Would require manual module resolution in browser. Not practical for modern development.

### 2. localStorage Best Practices

**Decision**: Single JSON array stored under one key

**Rationale**:
- Simple serialization/deserialization with `JSON.stringify`/`JSON.parse`
- Atomic updates (replace entire array)
- localStorage limit (~5MB) is sufficient for 100+ tasks
- No need for IndexedDB complexity at this scale

**Implementation Pattern**:
```typescript
const STORAGE_KEY = 'todo-tasks';

function loadTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
```

**Alternatives Considered**:
- **IndexedDB**: Overkill for simple CRUD with ~100 items. Adds async complexity.
- **Multiple keys per task**: More storage operations, harder to manage ordering.
- **sessionStorage**: Data lost on browser close - not suitable for persistence requirement.

### 3. Unique ID Generation for Tasks

**Decision**: `crypto.randomUUID()`

**Rationale**:
- Native browser API (no dependencies)
- Guaranteed uniqueness
- Supported in all modern browsers
- Simple string type (no special handling needed)

**Alternatives Considered**:
- **Incrementing integers**: Requires tracking max ID, problematic with deletions/localStorage corruption.
- **Date.now() + random**: Possible collisions with rapid creation.
- **uuid library**: External dependency for something browsers now provide natively.

### 4. Date Handling for Due Dates

**Decision**: Store as ISO 8601 string (YYYY-MM-DD), display with `Intl.DateTimeFormat`

**Rationale**:
- ISO strings are human-readable in storage and naturally sortable
- Date-only (no time component) matches spec requirement
- `Intl.DateTimeFormat` provides locale-aware display without libraries
- Native Date object for comparisons (overdue detection)

**Implementation Pattern**:
```typescript
// Storage format
interface Task {
  dueDate: string | null; // "2026-01-20" or null
}

// Display
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(new Date(isoDate));
}

// Overdue check
function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}
```

**Alternatives Considered**:
- **Unix timestamps**: Less readable in storage, requires conversion for display.
- **date-fns/dayjs library**: External dependency for simple date operations.
- **Full ISO with time**: Unnecessary complexity; spec only requires date.

### 5. DOM Manipulation Strategy

**Decision**: Template-based rendering with event delegation

**Rationale**:
- HTML templates (`<template>` element) keep markup out of JavaScript
- Event delegation on container reduces listener count
- Re-render on state change (simple mental model)
- No virtual DOM overhead for small app

**Implementation Pattern**:
```typescript
// Event delegation
taskListElement.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const taskId = target.closest('[data-task-id]')?.getAttribute('data-task-id');
  if (!taskId) return;

  if (target.matches('.complete-btn')) handleComplete(taskId);
  if (target.matches('.delete-btn')) handleDelete(taskId);
});
```

**Alternatives Considered**:
- **React/Vue/Svelte**: Framework overhead for 4 user stories. Rejected per Simplicity First.
- **Web Components**: More complexity than needed; no reuse requirements.
- **innerHTML string building**: XSS risk, harder to maintain.

### 6. Testing Strategy

**Decision**: Vitest with jsdom for unit tests, Playwright for integration

**Rationale**:
- Vitest: Fast, native TypeScript, compatible with Vite project
- jsdom: Lightweight DOM simulation for service/utility tests
- Playwright: Real browser testing for UI flows (if needed later)
- Start with unit tests; add integration tests per user story

**Test Structure**:
```
tests/
├── unit/
│   ├── taskService.test.ts  # CRUD operations
│   └── dateUtils.test.ts    # Date formatting, overdue logic
└── integration/
    └── taskFlow.test.ts     # Full user journeys (optional)
```

**Alternatives Considered**:
- **Jest**: Slower startup, requires more config for ESM/TypeScript.
- **Cypress**: Heavier than needed for unit tests; Playwright more versatile.

## Resolved Clarifications

All technical clarifications resolved. No NEEDS CLARIFICATION items remain.

## Open Questions for Planning Phase

None - ready to proceed to Phase 1 design.
