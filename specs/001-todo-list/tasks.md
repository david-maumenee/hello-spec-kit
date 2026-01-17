# Tasks: ToDo List Manager

**Input**: Design documents from `/specs/001-todo-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec - omitted per guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite project with TypeScript template in repository root
- [x] T002 Configure tsconfig.json with strict mode enabled
- [x] T003 [P] Configure ESLint with TypeScript plugin in eslint.config.js
- [x] T004 [P] Configure Prettier in .prettierrc
- [x] T005 [P] Create project directory structure per plan.md (src/models/, src/services/, src/components/, src/utils/, src/styles/)
- [x] T006 Create HTML shell with app container in src/index.html

**Checkpoint**: Project structure ready, build tools configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create Task interface and types in src/models/task.ts (Task, TaskStatus, CreateTaskInput, UpdateTaskInput)
- [x] T008 Create ValidationError and NotFoundError classes in src/services/errors.ts
- [x] T009 Implement localStorage helpers (loadTasks, saveTasks) in src/services/storage.ts
- [x] T010 Create base application styles in src/styles/main.css (layout, typography, variables)
- [x] T011 Create application entry point scaffold in src/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can create tasks with titles and see them displayed in a list

**Independent Test**: Create a task with title "Buy groceries", verify it appears in the list with "pending" status

### Implementation for User Story 1

- [x] T012 [US1] Implement createTask() in src/services/taskService.ts (validate title 1-200 chars, generate UUID, set status pending, persist)
- [x] T013 [US1] Implement getAllTasks() in src/services/taskService.ts (load from storage, sort by createdAt desc)
- [x] T014 [US1] Create TaskItem component in src/components/TaskItem.ts (render single task with title and status)
- [x] T015 [US1] Create TaskList component in src/components/TaskList.ts (render all tasks, handle empty state)
- [x] T016 [US1] Create TaskForm component in src/components/TaskForm.ts (title input, submit button, validation error display)
- [x] T017 [US1] Add styles for task list, task item, and form in src/styles/main.css
- [x] T018 [US1] Wire up components and initialize app in src/index.ts

**Checkpoint**: User Story 1 complete - can create tasks and view them in a list

---

## Phase 4: User Story 2 - Complete and Delete Tasks (Priority: P2)

**Goal**: Users can mark tasks complete/incomplete and delete tasks

**Independent Test**: Create a task, toggle it complete (verify visual change), toggle back to pending, delete it (verify removal)

### Implementation for User Story 2

- [x] T019 [US2] Implement toggleTaskStatus() in src/services/taskService.ts (find task, flip status, persist)
- [x] T020 [US2] Implement deleteTask() in src/services/taskService.ts (find task, remove from array, persist)
- [x] T021 [US2] Add complete toggle button to TaskItem in src/components/TaskItem.ts
- [x] T022 [US2] Add delete button with confirmation to TaskItem in src/components/TaskItem.ts
- [x] T023 [US2] Add completed task styling (strikethrough, muted colors) in src/styles/main.css
- [x] T024 [US2] Wire up toggle and delete event handlers in src/components/TaskList.ts

**Checkpoint**: User Stories 1 AND 2 complete - full basic task management

---

## Phase 5: User Story 3 - Set Due Dates (Priority: P3)

**Goal**: Users can assign due dates to tasks and see overdue tasks highlighted

**Independent Test**: Create a task with due date, verify date displays; set past date, verify overdue highlighting

### Implementation for User Story 3

- [x] T025 [US3] Create date utility functions in src/utils/dateUtils.ts (formatDate, isOverdue, getTodayISO)
- [x] T026 [US3] Add dueDate parameter to createTask() in src/services/taskService.ts
- [x] T027 [US3] Add date input field to TaskForm in src/components/TaskForm.ts
- [x] T028 [US3] Display due date in TaskItem in src/components/TaskItem.ts
- [x] T029 [US3] Add overdue detection and highlighting to TaskItem in src/components/TaskItem.ts
- [x] T030 [US3] Add overdue task styling (red highlight, warning indicator) in src/styles/main.css

**Checkpoint**: User Stories 1, 2, AND 3 complete - tasks with due dates and overdue alerts

---

## Phase 6: User Story 4 - Edit Tasks (Priority: P4)

**Goal**: Users can edit task title and due date

**Independent Test**: Create a task, edit title to new value, verify change persists; edit due date, verify update

### Implementation for User Story 4

- [x] T031 [US4] Implement updateTask() in src/services/taskService.ts (find task, validate, update fields, persist)
- [x] T032 [US4] Implement getTaskById() in src/services/taskService.ts (find single task by ID)
- [x] T033 [US4] Add edit mode to TaskItem in src/components/TaskItem.ts (inline editing or modal)
- [x] T034 [US4] Update TaskForm to support edit mode in src/components/TaskForm.ts (pre-fill values, update vs create)
- [x] T035 [US4] Add edit button and wire up edit flow in src/components/TaskList.ts
- [x] T036 [US4] Add edit mode styling in src/styles/main.css

**Checkpoint**: All user stories complete - full CRUD functionality

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T037 Add keyboard navigation and accessibility attributes (aria-labels, focus management) in src/components/
- [x] T038 Add responsive styles for mobile devices in src/styles/main.css
- [x] T039 Run quickstart.md validation - verify all documented commands work
- [x] T040 Final code cleanup and consistency review across all files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 → US2 → US3 → US4 (recommended sequential order)
  - Or US2, US3, US4 can proceed in parallel after US1 MVP is validated
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (needs TaskItem to add buttons)
- **User Story 3 (P3)**: Depends on US1 (needs TaskForm to add date input)
- **User Story 4 (P4)**: Depends on US1 + US3 (needs form and date handling)

### Within Each User Story

- Service layer before components
- Components before wiring/integration
- Core implementation before styling

### Parallel Opportunities

- Setup: T003, T004, T005 can run in parallel
- Foundational: T008 and T009 can run in parallel after T007
- US3: T025 (utils) and T026 (service) can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# After T001 and T002, launch these in parallel:
Task: "T003 [P] Configure ESLint with TypeScript plugin in eslint.config.js"
Task: "T004 [P] Configure Prettier in .prettierrc"
Task: "T005 [P] Create project directory structure per plan.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test creating and viewing tasks
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test complete/delete → Deploy/Demo
4. Add User Story 3 → Test due dates → Deploy/Demo
5. Add User Story 4 → Test editing → Deploy/Demo
6. Polish → Final release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- localStorage key: `todo-tasks`
- All dates in ISO format (YYYY-MM-DD)
