# Quickstart: ToDo List Manager

**Date**: 2026-01-17
**Feature**: 001-todo-list

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm

## Setup

```bash
# Clone and navigate to project
cd hello-spec-kit

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
hello-spec-kit/
├── src/
│   ├── models/
│   │   └── task.ts          # Task type definitions
│   ├── services/
│   │   └── taskService.ts   # CRUD operations + localStorage
│   ├── components/
│   │   ├── TaskList.ts      # Task list rendering
│   │   ├── TaskItem.ts      # Single task component
│   │   └── TaskForm.ts      # Create/edit form
│   ├── utils/
│   │   └── dateUtils.ts     # Date helpers
│   ├── styles/
│   │   └── main.css         # Application styles
│   ├── index.ts             # Entry point
│   └── index.html           # HTML shell
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── specs/                   # Feature specifications
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Development Workflow

### 1. Make Changes

Edit files in `src/`. The dev server will hot-reload changes.

### 2. Run Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- taskService

# Watch mode for TDD
npm run test:watch
```

### 3. Type Check

```bash
npm run typecheck
```

### 4. Lint & Format

```bash
npm run lint
npm run format
```

## Key Files

| File | Purpose |
|------|---------|
| `src/models/task.ts` | Task interface and types |
| `src/services/taskService.ts` | Task CRUD with localStorage |
| `src/components/TaskList.ts` | Main task list UI |
| `src/index.ts` | Application bootstrap |

## Browser Storage

Tasks are stored in `localStorage` under the key `todo-tasks`. To inspect:

1. Open browser DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Click on `http://localhost:5173`
5. Find the `todo-tasks` key

To clear all tasks:
```javascript
localStorage.removeItem('todo-tasks');
location.reload();
```

## Testing

### Unit Tests

Located in `tests/unit/`. Test pure functions and service logic.

```bash
npm run test -- unit
```

### Integration Tests

Located in `tests/integration/`. Test user flows end-to-end.

```bash
npm run test -- integration
```

## Troubleshooting

### Tasks not persisting

1. Check localStorage isn't disabled/full
2. Open DevTools Console for errors
3. Verify `todo-tasks` key exists in localStorage

### Build errors

```bash
# Clean and reinstall
rm -rf node_modules
npm install

# Check TypeScript errors
npm run typecheck
```

### Tests failing

```bash
# Run with verbose output
npm run test -- --reporter=verbose
```
