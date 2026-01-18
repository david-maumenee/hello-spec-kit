# Research: Multi-User Authentication & Cloud Sync

**Feature**: 002-multi-user-auth
**Date**: 2026-01-18

## Research Summary

This document captures technology decisions and best practices research for implementing multi-user authentication in the ToDo List application.

---

## 1. Password Hashing Library

### Decision: bcrypt

### Rationale
- Industry-standard algorithm specifically designed for password hashing
- Built-in salt generation prevents rainbow table attacks
- Configurable work factor allows scaling with hardware improvements
- Widely audited and battle-tested in production systems
- Constitution Principle IV explicitly allows bcrypt

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Argon2 | More modern but bcrypt is simpler to integrate with Node.js; both are constitution-compliant |
| scrypt | Less common in Node.js ecosystem; bcrypt has better tooling |
| PBKDF2 | Older, less resistant to GPU attacks compared to bcrypt |
| SHA-256 | Not a password hashing algorithm; lacks built-in salting and work factor |

### Implementation Notes
- Use `bcrypt` npm package (native bindings for performance)
- Work factor: 12 rounds (balances security and ~250ms hash time)
- Always use async methods (`bcrypt.hash`, `bcrypt.compare`) to avoid blocking event loop

---

## 2. Session Management Strategy

### Decision: Stateless JWT with short expiry + refresh token pattern

### Rationale
- Aligns with Simplicity First: no session store required in database
- Stateless tokens scale horizontally without shared state
- Short-lived access tokens (15 minutes) limit exposure if compromised
- Refresh tokens (stored in httpOnly cookie) enable "remember me" functionality
- Constitution session requirements (24h standard, 30d remember me) achieved via refresh token expiry

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Server-side sessions (express-session) | Requires session store; adds complexity; violates Simplicity First |
| Long-lived JWT only | Security risk if token compromised; no revocation mechanism |
| OAuth2/OpenID Connect | Over-engineered for single-app auth; social login is out of scope |

### Implementation Notes
- Access token: JWT signed with HS256, 15-minute expiry, stored in memory (frontend)
- Refresh token: Opaque token, 24h/30d expiry, stored in httpOnly cookie
- Refresh tokens stored in SQLite for revocation capability
- Token rotation: Issue new refresh token on each refresh to detect token theft

---

## 3. Database Choice

### Decision: SQLite with better-sqlite3

### Rationale
- Constitution allows: "PostgreSQL, MySQL, SQLite, or MongoDB"
- Aligns with Simplicity First: no separate database server required
- File-based: easy backup, deployment, and development
- `better-sqlite3` is synchronous but very fast; suitable for 100 concurrent users
- Single-file database simplifies operations for small-scale deployment

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| PostgreSQL | Requires separate server; overkill for 100 users; violates Simplicity First |
| MySQL | Same as PostgreSQL - unnecessary operational complexity |
| MongoDB | Document store not ideal for relational user/task data |
| In-memory (Map) | Not persistent; violates Constitution Data Persistence Guidelines |

### Implementation Notes
- Database file: `backend/db/app.db`
- Use WAL mode for concurrent read/write performance
- Foreign keys enabled for referential integrity
- Indexes on `users.email` and `tasks.user_id`

---

## 4. Email Delivery for Password Reset

### Decision: Nodemailer with SMTP configuration

### Rationale
- Standard Node.js email library with wide SMTP provider support
- Can use any SMTP service (Gmail, SendGrid, Mailgun, etc.)
- Development mode: use Ethereal.email for testing without real emails
- Constitution doesn't mandate specific email provider

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| SendGrid SDK | Vendor lock-in; SMTP is more portable |
| AWS SES SDK | Over-engineered for simple transactional emails |
| Custom SMTP | Same as Nodemailer decision |

### Implementation Notes
- Password reset tokens: 32-byte random string, stored hashed in database
- Token expiry: 1 hour (security best practice)
- Email contains link with token; never send password in email
- Rate limit: 3 password reset requests per email per hour

---

## 5. Frontend Authentication State

### Decision: In-memory state + localStorage for token persistence (access token only)

### Rationale
- Access token in memory prevents XSS access to sensitive data
- Refresh token in httpOnly cookie (server-set) prevents XSS entirely
- Simple state management without Redux/MobX overhead
- Aligns with Simplicity First

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| localStorage for all tokens | XSS vulnerability for refresh token |
| Redux/Zustand | Over-engineered for auth state; premature abstraction |
| sessionStorage only | Doesn't persist across tabs; poor UX |

### Implementation Notes
- On page load: attempt silent refresh via httpOnly cookie
- If refresh succeeds: store access token in memory, user is logged in
- If refresh fails: redirect to login page
- Logout: clear memory state + call logout endpoint to invalidate refresh token

---

## 6. API Security Best Practices

### Decision: Defense-in-depth approach

### Implementation
1. **CORS**: Restrict to same origin in production
2. **Helmet.js**: Security headers (CSP, X-Frame-Options, etc.)
3. **Rate limiting**: express-rate-limit for auth endpoints
4. **Input validation**: Zod schemas for all request bodies
5. **Error opacity**: Generic error messages for auth failures (per Constitution)

### Rate Limits
- Login: 5 attempts per 15 minutes per IP
- Registration: 10 per hour per IP
- Password reset request: 3 per hour per email

---

## 7. Password Validation Rules

### Decision: Per Constitution Principle IV

### Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Optional: reject common passwords (top 1000)

### Implementation Notes
- Validate on frontend (UX) and backend (security)
- Use Zod schema with regex pattern
- Clear error messages guiding user to fix specific issues

---

## Resolved Clarifications

All technical decisions align with Constitution v1.2.0. No additional clarifications needed.

| Item | Resolution |
|------|------------|
| Password hashing | bcrypt (Constitution allows bcrypt, Argon2) |
| Session management | JWT + refresh token (Constitution: 24h/30d) |
| Database | SQLite (Constitution: server-side database) |
| Email | Nodemailer + SMTP |
| Conflict resolution | Last-write-wins (Constitution Data Persistence) |
