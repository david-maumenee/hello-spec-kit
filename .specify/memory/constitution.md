<!--
  Sync Impact Report
  ==================
  Version change: 1.1.0 → 1.2.0 (MINOR - new sections added)

  Modified principles: None

  Added sections:
  - Data Persistence Guidelines (under Technology Constraints)
  - Authentication & Security Guidelines (new principle IV)

  Removed sections: None

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (no changes needed - Technical Context already has Storage field)
  - .specify/templates/spec-template.md ✅ (no changes needed)
  - .specify/templates/tasks-template.md ✅ (already includes authentication/authorization in foundational phase)

  Follow-up TODOs: None
-->

# Hello Spec Kit Constitution

## Core Principles

### I. Spec-Driven Development

Every feature MUST begin with a specification before any implementation work starts.

- **Specification First**: Feature specifications MUST be written and approved before coding begins
- **User Stories Required**: Each spec MUST contain user stories with acceptance scenarios in Given/When/Then format
- **Priority-Based**: User stories MUST be assigned priorities (P1, P2, P3) to guide implementation order
- **Testable Requirements**: All requirements MUST be specific enough to derive test cases from acceptance scenarios
- **Change Control**: Spec modifications after approval MUST be documented and re-approved

**Rationale**: Specifications prevent scope creep, ensure shared understanding, and provide clear success criteria before investment in code.

### II. Incremental Delivery

Features MUST be delivered in independently testable and deployable increments.

- **MVP First**: User Story 1 (P1) MUST be fully functional before starting lower-priority stories
- **Independent Stories**: Each user story MUST be independently testable and deliverable
- **Checkpoint Validation**: Each story completion MUST include a validation checkpoint
- **No Big Bang**: Avoid large releases; prefer small, frequent, working increments
- **User Value**: Every increment MUST deliver measurable value to users

**Rationale**: Incremental delivery reduces risk, enables early feedback, and ensures continuous progress visibility.

### III. Simplicity First

Start with the simplest solution that meets requirements. Complexity MUST be justified.

- **YAGNI**: Do NOT implement features "for later" - build only what is needed now
- **Minimal Abstraction**: Avoid premature abstractions; three similar lines of code are better than a premature helper
- **No Over-Engineering**: Reject unnecessary layers, patterns, or infrastructure
- **Justify Complexity**: Any deviation from the simplest solution MUST be documented with rationale
- **Delete Over Comment**: Remove unused code rather than commenting it out

**Rationale**: Simplicity reduces maintenance burden, cognitive load, and defect rates while accelerating delivery.

### IV. Authentication & Security

User authentication and data protection MUST follow industry-standard security practices.

- **Password Security**: Passwords MUST be hashed using bcrypt, Argon2, or equivalent algorithms; plaintext storage is NEVER permitted
- **Session Management**: Sessions MUST have configurable expiration (default: 24 hours standard, 30 days with "remember me")
- **Token Security**: Authentication tokens (JWT or session tokens) MUST be transmitted only over HTTPS in production
- **Input Validation**: All user inputs MUST be validated and sanitized before processing
- **Error Opacity**: Authentication error messages MUST NOT reveal whether an email/username exists in the system
- **Password Requirements**: Passwords MUST enforce minimum strength requirements (8+ characters, mixed case, numbers)
- **Account Deletion**: Users MUST be able to permanently delete their accounts and all associated data

**Rationale**: Security vulnerabilities erode user trust and expose the project to legal and reputational risk. These non-negotiable practices establish a baseline defense.

## Technology Constraints

### Runtime & Language

| Component | Requirement | Notes |
|-----------|-------------|-------|
| **Runtime** | Node.js (LTS) | Use current LTS version |
| **Language** | TypeScript | Required for all source code |
| **Strict Mode** | `"strict": true` | MUST be enabled in tsconfig.json |

### Framework Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Web Framework** | Express.js | Minimal, flexible, aligns with Simplicity First |
| **Testing** | Jest or Vitest | Use project's existing test runner |
| **Linting** | ESLint | With TypeScript plugin |
| **Formatting** | Prettier | Consistent code style |

### Constraints

- **No Framework Switching**: Express.js is the mandated framework; alternatives require constitution amendment
- **Type Safety**: `any` type SHOULD be avoided; explicit types MUST be used for public APIs
- **Dependencies**: New dependencies MUST be justified; prefer built-in Node.js APIs when sufficient
- **Node.js APIs**: Prefer `node:` prefixed imports (e.g., `import fs from 'node:fs'`)

### Data Persistence Guidelines

User data MUST be stored persistently in a server-side database. Browser-based storage (localStorage, sessionStorage, IndexedDB) MUST NOT be used as the primary data store.

| Aspect | Requirement | Notes |
|--------|-------------|-------|
| **Storage Type** | Server-side database | PostgreSQL, MySQL, SQLite, or MongoDB |
| **Data Durability** | Indefinite retention | Data persists until explicit user deletion |
| **Cross-Device Access** | Required | Users MUST access their data from any authenticated device |
| **Conflict Resolution** | Last-write-wins | Server timestamp determines authoritative version |
| **Backup Strategy** | Recommended | Regular database backups for disaster recovery |

**Prohibited Storage Patterns**:

- Browser localStorage/sessionStorage as primary data store
- Client-only IndexedDB without server synchronization
- Cookies for storing user data (authentication tokens only)
- In-memory storage without persistence layer

**Rationale**: Persistent server-side storage ensures data survives device changes, browser clears, and accidental data loss while enabling cross-device access.

### Project Structure

```text
src/
├── routes/          # Express route handlers
├── services/        # Business logic
├── models/          # Data types and interfaces
├── middleware/      # Express middleware
└── utils/           # Shared utilities

tests/
├── unit/            # Unit tests
├── integration/     # Integration tests
└── contract/        # API contract tests
```

## Development Workflow

### Feature Development Process

1. **Specify**: Create feature specification using `/speckit.specify`
2. **Clarify**: Resolve ambiguities with `/speckit.clarify`
3. **Plan**: Generate implementation plan with `/speckit.plan`
4. **Tasks**: Break down into actionable tasks with `/speckit.tasks`
5. **Implement**: Execute tasks following the plan with `/speckit.implement`
6. **Validate**: Verify against spec acceptance criteria

### Code Changes

- All code changes MUST trace back to a specification requirement
- Unplanned work MUST be added to the spec before implementation
- Refactoring without behavioral change does not require spec updates

## Quality Standards

### Documentation

- Feature specs live in `/specs/[feature-name]/`
- Implementation plans MUST reference their source specification
- Code comments are reserved for "why" not "what"

### Testing

- Tests SHOULD be derived from spec acceptance scenarios
- Each user story SHOULD have at least one integration test
- Tests are optional unless explicitly requested in the specification

## Governance

### Constitution Authority

This constitution supersedes all other development practices for this project. When conflicts arise, this document takes precedence.

### Amendment Process

1. Propose change with rationale
2. Document impact on existing specs and code
3. Update constitution with version increment
4. Propagate changes to dependent templates

### Versioning Policy

- **MAJOR**: Principle removal or fundamental redefinition
- **MINOR**: New principle added or existing principle materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance

- All pull requests MUST be reviewed for constitution compliance
- Violations MUST be documented in the Complexity Tracking section of plans
- Justified violations are acceptable; undocumented violations are not

**Version**: 1.2.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-18
