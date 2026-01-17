# Implementation Plan: ToDo List Manager

**Branch**: `001-todo-list` | **Date**: 2026-01-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-list/spec.md`

## Summary

Build a frontend-only single page application (SPA) for managing a personal todo list. Users can create, view, edit, complete, and delete tasks with optional due dates. Tasks persist in browser localStorage. The app visually distinguishes completed and overdue tasks.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Vanilla TypeScript (no framework) - aligns with Simplicity First
**Storage**: Browser localStorage
**Testing**: Vitest (modern, fast, TypeScript-native)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single frontend project (SPA)
**Performance Goals**: Display 100 tasks without delay; task operations < 2 seconds
**Constraints**: Offline-capable (localStorage), no server required
**Scale/Scope**: Single user, ~100 tasks typical usage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec-Driven Development | ✅ PASS | Spec completed with 4 user stories, acceptance scenarios in Given/When/Then |
| II. Incremental Delivery | ✅ PASS | Stories prioritized P1-P4, each independently testable |
| III. Simplicity First | ✅ PASS | Frontend-only, localStorage, no framework - simplest viable solution |
| Technology: TypeScript | ✅ PASS | Using TypeScript with strict mode |
| Technology: Express.js | ⚠️ N/A | Express.js is backend framework; this is frontend-only SPA per spec clarification |

**Justified Deviation**: The constitution mandates Express.js, but this applies to backend/API applications. The spec explicitly clarifies this is a "Frontend-only SPA (single page app, all logic in browser)" with "browser storage only". Express.js is not applicable to pure frontend applications. This deviation is justified by the Simplicity First principle - adding a backend would introduce unnecessary complexity for a single-user, localStorage-based app.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal API contracts)
├── checklists/          # Quality checklists
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── task.ts          # Task interface and type definitions
├── services/
│   └── taskService.ts   # Task CRUD operations and localStorage
├── components/
│   ├── TaskList.ts      # Task list rendering
│   ├── TaskItem.ts      # Individual task rendering
│   └── TaskForm.ts      # Task create/edit form
├── utils/
│   └── dateUtils.ts     # Date formatting and overdue detection
├── styles/
│   └── main.css         # Application styles
├── index.ts             # Application entry point
└── index.html           # HTML shell

tests/
├── unit/
│   ├── taskService.test.ts
│   └── dateUtils.test.ts
└── integration/
    └── taskFlow.test.ts
```

**Structure Decision**: Single frontend project structure. Components are vanilla TypeScript classes/functions that manipulate the DOM directly, keeping with the Simplicity First principle (no React/Vue/Angular overhead for a simple CRUD app).

## Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No Express.js | Frontend-only SPA with localStorage | Backend would add unnecessary complexity for single-user local app |
