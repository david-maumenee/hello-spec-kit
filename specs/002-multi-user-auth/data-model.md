# Data Model: Multi-User Authentication & Cloud Sync

**Feature**: 002-multi-user-auth
**Date**: 2026-01-18

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      User        │       │      Task        │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │──────<│ id (PK)          │
│ email (UNIQUE)   │       │ user_id (FK)     │
│ password_hash    │       │ title            │
│ created_at       │       │ completed        │
│ updated_at       │       │ created_at       │
└──────────────────┘       │ updated_at       │
        │                  └──────────────────┘
        │
        │       ┌──────────────────────┐
        │       │    RefreshToken      │
        └──────<├──────────────────────┤
        │       │ id (PK)              │
        │       │ user_id (FK)         │
        │       │ token_hash           │
        │       │ expires_at           │
        │       │ created_at           │
        │       └──────────────────────┘
        │
        │       ┌──────────────────────┐
        │       │  PasswordResetToken  │
        └──────<├──────────────────────┤
                │ id (PK)              │
                │ user_id (FK)         │
                │ token_hash           │
                │ expires_at           │
                │ used_at              │
                │ created_at           │
                └──────────────────────┘
```

## Entities

### User

Represents a registered individual with authentication credentials.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PK, UUID | Unique identifier |
| email | TEXT | UNIQUE, NOT NULL | User's email address (login identifier) |
| password_hash | TEXT | NOT NULL | bcrypt hash of password |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Validation Rules:**
- Email: Valid email format, case-insensitive uniqueness
- Password (pre-hash): 8+ chars, 1 uppercase, 1 lowercase, 1 number

**Indexes:**
- `idx_users_email` on `email` (for login lookup)

---

### Task

User-owned task item. Extended from existing Task entity with user association.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PK, UUID | Unique identifier |
| user_id | TEXT | FK → User.id, NOT NULL | Owner of the task |
| title | TEXT | NOT NULL | Task description |
| completed | INTEGER | NOT NULL, DEFAULT 0 | 0 = incomplete, 1 = complete |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |
| updated_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Validation Rules:**
- Title: 1-500 characters, trimmed whitespace
- User can only access/modify their own tasks (enforced at API level)

**Indexes:**
- `idx_tasks_user_id` on `user_id` (for fetching user's tasks)

**Cascade:**
- ON DELETE CASCADE from User (when user deletes account, tasks are deleted)

---

### RefreshToken

Stores hashed refresh tokens for session management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PK, UUID | Unique identifier |
| user_id | TEXT | FK → User.id, NOT NULL | Token owner |
| token_hash | TEXT | NOT NULL | SHA-256 hash of token |
| expires_at | TEXT | NOT NULL | ISO 8601 expiration timestamp |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Validation Rules:**
- Tokens expire after 24 hours (standard) or 30 days ("remember me")
- Only unhashed token sent to client; database stores hash

**Indexes:**
- `idx_refresh_tokens_user_id` on `user_id` (for logout all sessions)
- `idx_refresh_tokens_token_hash` on `token_hash` (for token lookup)

**Cascade:**
- ON DELETE CASCADE from User

---

### PasswordResetToken

Stores hashed password reset tokens for recovery flow.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PK, UUID | Unique identifier |
| user_id | TEXT | FK → User.id, NOT NULL | Token owner |
| token_hash | TEXT | NOT NULL | SHA-256 hash of token |
| expires_at | TEXT | NOT NULL | ISO 8601 expiration (1 hour) |
| used_at | TEXT | NULL | Timestamp when token was used |
| created_at | TEXT | NOT NULL | ISO 8601 timestamp |

**Validation Rules:**
- Token valid only if: `used_at IS NULL AND expires_at > NOW()`
- Token can only be used once
- Old unused tokens invalidated when new token requested

**Indexes:**
- `idx_password_reset_tokens_token_hash` on `token_hash`

**Cascade:**
- ON DELETE CASCADE from User

---

## SQLite Schema

```sql
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);

-- Trigger to update updated_at on users
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- Trigger to update updated_at on tasks
CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp
    AFTER UPDATE ON tasks
    FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = datetime('now') WHERE id = OLD.id;
END;
```

---

## TypeScript Interfaces

```typescript
// backend/src/models/user.ts
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

// Omit sensitive fields for API responses
export type UserPublic = Omit<User, 'passwordHash'>;

// backend/src/models/task.ts
export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// backend/src/models/refresh-token.ts
export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

// backend/src/models/password-reset-token.ts
export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}
```

---

## State Transitions

### User Account Lifecycle

```
[New Visitor]
    ↓ (register)
[Registered User]
    ↓ (login)
[Authenticated Session]
    ↓ (logout / session expires)
[Registered User]
    ↓ (delete account)
[Deleted] (cascade deletes all user data)
```

### Password Reset Flow

```
[User requests reset]
    ↓
[Token Created] (expires_at = now + 1 hour)
    ↓ (user clicks email link)
[Token Validated] (check: unused, not expired)
    ↓ (user submits new password)
[Token Used] (used_at = now)
    ↓
[Password Updated] (all sessions invalidated)
```

### Session Token Lifecycle

```
[Login Success]
    ↓
[Access Token Issued] (15 min expiry, in memory)
[Refresh Token Issued] (24h/30d expiry, httpOnly cookie)
    ↓ (access token expires)
[Refresh Request]
    ↓ (valid refresh token)
[New Access Token] + [New Refresh Token] (token rotation)
    ↓ (logout or refresh token expires)
[Session Ended] (refresh token deleted from DB)
```
