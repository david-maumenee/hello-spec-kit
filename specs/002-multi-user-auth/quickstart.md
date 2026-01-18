# Quickstart: Multi-User Authentication & Cloud Sync

**Feature**: 002-multi-user-auth
**Date**: 2026-01-18

This guide walks through setting up and running the authenticated ToDo List application.

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+

## Project Setup

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY_STANDARD=24h
JWT_REFRESH_EXPIRY_REMEMBER=30d

# Database
DATABASE_PATH=./db/app.db

# Email (development - uses Ethereal)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass
EMAIL_FROM=noreply@todoapp.local

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Initialize Database

```bash
cd backend
npm run db:init
```

This creates `backend/db/app.db` with the schema from `data-model.md`.

### 4. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## User Flows

### Register (User Story 1)

1. Navigate to http://localhost:5173
2. Click "Sign Up"
3. Enter email and password (8+ chars, mixed case, number)
4. Click "Create Account"
5. You're logged in and see your empty task list

### Login (User Story 2)

1. Navigate to http://localhost:5173
2. Enter email and password
3. Optionally check "Remember me" for 30-day session
4. Click "Login"
5. You see your task list

### Cross-Device Access (User Story 3)

1. Login on Device A, create a task
2. Open another browser/device
3. Login with same account
4. Task appears on Device B

### Logout (User Story 4)

1. Click your email in the header
2. Click "Logout"
3. Session ends, redirected to login

### Password Recovery (User Story 5)

1. On login page, click "Forgot Password"
2. Enter your email
3. Check email (in dev: check Ethereal inbox)
4. Click reset link
5. Enter new password
6. Login with new password

## API Testing

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "test@example.com", "password": "SecurePass123"}'
```

### Get Tasks (authenticated)

```bash
# Use the accessToken from login response
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <accessToken>"
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task"}'
```

## Verification Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can create a task
- [ ] Task persists after page refresh
- [ ] Task syncs to another browser/device
- [ ] Can logout
- [ ] Cannot access tasks after logout
- [ ] Password reset email sends (check Ethereal)

## Troubleshooting

### "Database is locked"

SQLite is single-writer. Ensure only one backend instance runs.

### "JWT_SECRET not set"

Ensure `backend/.env` exists with all required variables.

### "CORS error"

Verify `VITE_API_URL` matches backend address. Check backend CORS config.

### "Email not sending"

In development, use Ethereal. Check credentials at https://ethereal.email/

## Next Steps

After verification:

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement tasks in priority order (P1 → P2 → P3)
3. Run tests: `npm test`
4. Deploy (update environment variables for production)
