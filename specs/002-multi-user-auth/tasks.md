# Tasks: Multi-User Authentication & Cloud Sync

**Input**: Design documents from `/specs/002-multi-user-auth/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Database**: `backend/db/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create project structure for backend and frontend

- [x] T001 Create backend directory structure: `backend/src/{models,services,routes,middleware,utils}/`
- [x] T002 [P] Create frontend directory structure: `frontend/src/{components,pages,services,utils}/`
- [x] T003 [P] Initialize backend package.json with Express.js, TypeScript, bcrypt, better-sqlite3, jsonwebtoken dependencies in `backend/package.json`
- [x] T004 [P] Initialize frontend package.json with Vite, TypeScript dependencies in `frontend/package.json`
- [x] T005 [P] Create backend tsconfig.json with strict mode enabled in `backend/tsconfig.json`
- [x] T006 [P] Create frontend tsconfig.json with strict mode enabled in `frontend/tsconfig.json`
- [x] T007 [P] Create backend .env.example with all required environment variables in `backend/.env.example`
- [x] T008 [P] Create frontend .env.example with VITE_API_URL in `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create SQLite schema file with all tables (users, tasks, refresh_tokens, password_reset_tokens) in `backend/db/schema.sql`
- [x] T010 Implement database initialization script to run schema in `backend/src/utils/db.ts`
- [x] T011 [P] Create User interface and types in `backend/src/models/user.ts`
- [x] T012 [P] Create Task interface and types in `backend/src/models/task.ts`
- [x] T013 [P] Create RefreshToken interface in `backend/src/models/refresh-token.ts`
- [x] T014 [P] Create PasswordResetToken interface in `backend/src/models/password-reset-token.ts`
- [x] T015 Implement password hashing utilities (hash, compare) using bcrypt in `backend/src/utils/password.ts`
- [x] T016 [P] Implement JWT utilities (sign, verify) for access tokens in `backend/src/utils/jwt.ts`
- [x] T017 [P] Implement token generation utility for refresh/reset tokens in `backend/src/utils/token.ts`
- [x] T018 [P] Create Zod validation schemas for all request types in `backend/src/utils/validation.ts`
- [x] T019 Implement authentication middleware to verify JWT in `backend/src/middleware/auth.ts`
- [x] T020 [P] Implement error handling middleware in `backend/src/middleware/error.ts`
- [x] T021 [P] Implement rate limiting middleware in `backend/src/middleware/rate-limit.ts`
- [x] T022 Create Express app with CORS, helmet, cookie-parser in `backend/src/app.ts`
- [x] T023 Create backend entry point with server startup in `backend/src/index.ts`
- [x] T024 [P] Create API client service for frontend in `frontend/src/services/api.ts`
- [x] T025 [P] Create auth state management service in `frontend/src/services/auth.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - New User Registration (Priority: P1)

**Goal**: Allow new users to create an account and access an empty task list

**Independent Test**: Create a new account with valid credentials, verify access to empty task list

### Implementation for User Story 1

- [x] T026 [US1] Implement UserService.create() with email uniqueness check in `backend/src/services/user-service.ts`
- [x] T027 [US1] Implement AuthService.register() with password hashing and token generation in `backend/src/services/auth-service.ts`
- [x] T028 [US1] Implement POST /auth/register route handler in `backend/src/routes/auth.ts`
- [x] T029 [US1] Create RegisterPage component with email/password form in `frontend/src/pages/RegisterPage.tsx`
- [x] T030 [US1] Create RegisterForm component with validation in `frontend/src/components/RegisterForm.tsx`
- [x] T031 [US1] Implement password strength validation in `frontend/src/utils/validation.ts`
- [x] T032 [US1] Create empty TaskList component (placeholder) in `frontend/src/components/TaskList.tsx`
- [x] T033 [US1] Wire RegisterPage to auth service and redirect to task list on success in `frontend/src/pages/RegisterPage.tsx`

**Checkpoint**: User Story 1 complete - new users can register and see empty task list

---

## Phase 4: User Story 2 - Existing User Login (Priority: P1)

**Goal**: Allow returning users to log in and see their tasks

**Independent Test**: Log in with valid credentials, verify existing tasks are displayed

### Implementation for User Story 2

- [x] T034 [US2] Implement AuthService.login() with credential verification in `backend/src/services/auth-service.ts`
- [x] T035 [US2] Implement RefreshTokenService for token storage/validation in `backend/src/services/refresh-token-service.ts`
- [x] T036 [US2] Implement POST /auth/login route handler with cookie setting in `backend/src/routes/auth.ts`
- [x] T037 [US2] Implement POST /auth/refresh route handler for token refresh in `backend/src/routes/auth.ts`
- [x] T038 [US2] Create LoginPage component with email/password form in `frontend/src/pages/LoginPage.tsx`
- [x] T039 [US2] Create LoginForm component in `frontend/src/components/LoginForm.tsx`
- [x] T040 [US2] Implement silent refresh on app load in auth service in `frontend/src/services/auth.ts`
- [x] T041 [US2] Create protected route wrapper component in `frontend/src/components/ProtectedRoute.tsx`
- [x] T042 [US2] Set up frontend routing with login/register/tasks pages in `frontend/src/App.tsx`

**Checkpoint**: User Story 2 complete - users can log in and maintain sessions

---

## Phase 5: User Story 3 - Cross-Device Data Access (Priority: P2)

**Goal**: Users can create/view/modify tasks that sync across devices

**Independent Test**: Create task on Device A, log in on Device B, verify task appears

### Implementation for User Story 3

- [x] T043 [US3] Implement TaskService.findByUserId() in `backend/src/services/task-service.ts`
- [x] T044 [US3] Implement TaskService.create() with user association in `backend/src/services/task-service.ts`
- [x] T045 [US3] Implement TaskService.update() with ownership check in `backend/src/services/task-service.ts`
- [x] T046 [US3] Implement TaskService.delete() with ownership check in `backend/src/services/task-service.ts`
- [x] T047 [US3] Implement GET /tasks route handler in `backend/src/routes/tasks.ts`
- [x] T048 [US3] Implement POST /tasks route handler in `backend/src/routes/tasks.ts`
- [x] T049 [US3] Implement PATCH /tasks/:id route handler in `backend/src/routes/tasks.ts`
- [x] T050 [US3] Implement DELETE /tasks/:id route handler in `backend/src/routes/tasks.ts`
- [x] T051 [US3] Register tasks router in Express app in `backend/src/app.ts`
- [x] T052 [US3] Create TaskPage component as main authenticated view in `frontend/src/pages/TaskPage.tsx`
- [x] T053 [US3] Implement TaskList component with fetch and display in `frontend/src/components/TaskList.tsx`
- [x] T054 [US3] Create AddTaskForm component in `frontend/src/components/AddTaskForm.tsx`
- [x] T055 [US3] Create TaskItem component with toggle/delete in `frontend/src/components/TaskItem.tsx`
- [x] T056 [US3] Implement task API methods in `frontend/src/services/api.ts`

**Checkpoint**: User Story 3 complete - tasks sync across devices

---

## Phase 6: User Story 4 - User Logout (Priority: P2)

**Goal**: Users can log out to secure their account

**Independent Test**: Click logout, verify redirected to login and cannot access tasks

### Implementation for User Story 4

- [x] T057 [US4] Implement AuthService.logout() to invalidate refresh token in `backend/src/services/auth-service.ts`
- [x] T058 [US4] Implement POST /auth/logout route handler with cookie clearing in `backend/src/routes/auth.ts`
- [x] T059 [US4] Create Header component with user email and logout button in `frontend/src/components/Header.tsx`
- [x] T060 [US4] Implement logout in auth service (clear state, call API) in `frontend/src/services/auth.ts`
- [x] T061 [US4] Add Header to TaskPage in `frontend/src/pages/TaskPage.tsx`

**Checkpoint**: User Story 4 complete - users can securely log out

---

## Phase 7: User Story 5 - Password Recovery (Priority: P3)

**Goal**: Users can reset forgotten passwords via email

**Independent Test**: Request reset, use email link, verify login with new password works

### Implementation for User Story 5

- [x] T062 [US5] Implement EmailService with Nodemailer setup in `backend/src/services/email-service.ts`
- [x] T063 [US5] Implement PasswordResetService.createToken() in `backend/src/services/password-reset-service.ts`
- [x] T064 [US5] Implement PasswordResetService.validateToken() in `backend/src/services/password-reset-service.ts`
- [x] T065 [US5] Implement PasswordResetService.resetPassword() in `backend/src/services/password-reset-service.ts`
- [x] T066 [US5] Implement POST /auth/forgot-password route handler in `backend/src/routes/auth.ts`
- [x] T067 [US5] Implement POST /auth/reset-password route handler in `backend/src/routes/auth.ts`
- [x] T068 [US5] Create ForgotPasswordPage component in `frontend/src/pages/ForgotPasswordPage.tsx`
- [x] T069 [US5] Create ResetPasswordPage component (token from URL) in `frontend/src/pages/ResetPasswordPage.tsx`
- [x] T070 [US5] Add forgot password link to LoginPage in `frontend/src/pages/LoginPage.tsx`
- [x] T071 [US5] Add password reset routes to frontend router in `frontend/src/App.tsx`

**Checkpoint**: User Story 5 complete - password recovery fully functional

---

## Phase 8: Account Management (FR-013)

**Goal**: Users can delete their account and all associated data

**Independent Test**: Delete account, verify cannot log in and all data removed

### Implementation for Account Management

- [x] T072 Implement UserService.delete() with cascade in `backend/src/services/user-service.ts`
- [x] T073 Implement GET /account route handler in `backend/src/routes/account.ts`
- [x] T074 Implement DELETE /account route handler with password confirmation in `backend/src/routes/account.ts`
- [x] T075 Register account router in Express app in `backend/src/app.ts`
- [x] T076 Create AccountSettingsPage with delete account option in `frontend/src/pages/AccountSettingsPage.tsx`
- [x] T077 Create DeleteAccountModal with password confirmation in `frontend/src/components/DeleteAccountModal.tsx`
- [x] T078 Add settings link to Header component in `frontend/src/components/Header.tsx`

**Checkpoint**: Account deletion fully functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, error handling, and deployment prep

- [x] T079 [P] Add comprehensive error messages for all API responses in `backend/src/routes/*.ts`
- [x] T080 [P] Add loading states to all frontend forms in `frontend/src/components/*.tsx`
- [ ] T081 [P] Add toast notifications for success/error feedback in `frontend/src/components/Toast.tsx`
- [x] T082 Create npm scripts for dev, build, start in `backend/package.json`
- [x] T083 [P] Create npm scripts for dev, build in `frontend/package.json`
- [ ] T084 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 - Can start after foundation
- **User Story 2 (Phase 4)**: Depends on Phase 2 - Can run parallel to US1
- **User Story 3 (Phase 5)**: Depends on Phase 2 - Can run parallel to US1/US2
- **User Story 4 (Phase 6)**: Depends on Phase 4 (needs login) - Sequential after US2
- **User Story 5 (Phase 7)**: Depends on Phase 2 - Can run parallel to US1-US4
- **Account Mgmt (Phase 8)**: Depends on Phase 2 - Can run parallel to US1-US5
- **Polish (Phase 9)**: Depends on all user stories

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) ← BLOCKING
    ↓
┌───────────────────────────────────────┐
│  US1 (Register) ─┬─→ US4 (Logout)     │
│  US2 (Login) ────┘                    │  Can run in parallel
│  US3 (Tasks)                          │  (if team capacity)
│  US5 (Password Reset)                 │
│  Account Management                   │
└───────────────────────────────────────┘
    ↓
Phase 9 (Polish)
```

### Within Each User Story

- Backend services before routes
- Routes before frontend pages
- Core components before integration

### Parallel Opportunities

**Phase 1** (all [P] tasks):
```
T002, T003, T004, T005, T006, T007, T008 can run in parallel
```

**Phase 2** (all [P] tasks):
```
T011, T012, T013, T014 can run in parallel (models)
T016, T017, T018 can run in parallel (utils)
T020, T021 can run in parallel (middleware)
T024, T025 can run in parallel (frontend services)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Registration)
4. Complete Phase 4: User Story 2 (Login)
5. **STOP and VALIDATE**: Users can register, login, and maintain sessions
6. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. Setup + Foundation → Ready
2. + US1 + US2 → MVP (auth works)
3. + US3 → Users have tasks that sync
4. + US4 → Secure logout
5. + US5 → Password recovery
6. + Account Mgmt → Full feature complete

---

## Notes

- [P] tasks = different files, no dependencies
- [USn] label maps task to specific user story for traceability
- Each user story is independently testable after its phase completes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
