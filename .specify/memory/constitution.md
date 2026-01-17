<!--
  Sync Impact Report
  ==================
  Version change: 1.0.0 → 1.1.0 (MINOR - new section added)

  Modified principles: None

  Added sections:
  - Technology Constraints (Node.js + Express.js + TypeScript stack)

  Removed sections: None

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Technical Context section will use these defaults)
  - .specify/templates/spec-template.md ✅ (no changes needed)
  - .specify/templates/tasks-template.md ✅ (no changes needed)

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

**Version**: 1.1.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
