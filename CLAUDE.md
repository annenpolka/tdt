# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**tdt** is a Node.js TypeScript application for Todoist API integration. It's a CLI tool for task management using the official Todoist TypeScript SDK.

## Development Guidelines

### Code Standards
- Follow **t-wada's TDD** approach
- never use classes; prefer functional programming
- Adhere to lint rules
- Respect functional programming principles (immutability, pure functions)
- Prioritize type safety and avoid `any` type
- Document with JSDoc comments

## Error Handling Policy

This project follows a strict no-exceptions design policy:

- **NEVER throw exceptions** in application code
- **ALWAYS use Result types** for error handling instead of throwing
- **ALL functions that can fail** must return `Result<T, E>` instead of throwing
- Use explicit error handling over implicit exception propagation

### Result Type Implementation

This project uses the neverthrow library:

- Install: `pnpm add neverthrow`
- Import: `import { Result, ok, err } from "neverthrow"`
- Use `result.isOk()` and `result.isErr()` for type checking

### Mandatory Practices

1. **Function Return Types**: All functions that can fail must return `Result<SuccessType, ErrorType>`
2. **Error Checking**: Always use `result.isOk()` / `result.isErr()` for type-safe error checking  
3. **No Exception Throwing**: Never use `throw` statements in application code
4. **Async Operations**: Wrap promises with `ResultAsync.fromPromise()` or `fromPromise()`
5. **External Libraries**: Wrap third-party code that might throw using `fromThrowable()` or `ResultAsync.fromPromise()`

## Domain Modeling Rules

When implementing domain logic:

1. **Use Algebraic Data Types**: Model domain with sum types (tagged unions) and product types
2. **Keep Core Pure**: All functions in `src/core/` must be pure and synchronous (no async/await)
3. **Use Branded Types**: Wrap primitive types (string IDs, emails, etc.) with branded types
4. **Test Domain Logic**: Write unit tests for all domain functions
5. **Test Infrastructure**: Write integration tests for all IO operations in `src/infra/`
6. **Separate Concerns**: Keep side effects in `src/infra/`, pure logic in `src/core/`

### Project Structure

```
src/
├── core/           # Pure domain models and logic
│   ├── task.ts     # Task domain model
│   ├── project.ts  # Project domain model
│   └── shared.ts   # Shared types and utilities
├── infra/          # Infrastructure and side effects
└── app/            # Application layer
```

### Domain Modeling Best Practices

**Do:**
- Model your domain with types first
- Make illegal states unrepresentable
- Keep domain logic pure and testable
- Use branded types for type safety
- Test domain logic thoroughly

**Don't:**
- Put async functions in core domain
- Mix infrastructure concerns with domain logic
- Use classes for pure data (prefer types/interfaces)
- Throw exceptions in domain logic (use Result types)

### Testing Strategy
- Test-driven development (TDD) using Vitest following **t-wada's** approach

### Technology Stack (planned)
- **Language**: TypeScript
- **UI Framework**: Ink (React)
- **Type Definition/Validation**: Zod
- **Error Handling**: neverthrow
- **Testing**: Vitest
- **Package Management**: pnpm
- **Data Storage**: SQLite with Prisma ORM

## Development Commands

### Setup and Dependencies
```bash
pnpm install                    # Install dependencies
```

### Development Workflow
```bash
pnpm dev                       # Run in development mode with ts-node
pnpm build                     # Compile TypeScript to dist/
pnpm start                     # Build and run production version
```

### Environment Configuration
- Create `.env` file with `TODOIST_API_KEY=your_api_token`
- API key is required for all Todoist API operations
- Development mode automatically loads dotenv

## Development Notes
- Build output goes to `dist/` directory
- Source maps and declarations are generated
- Development mode uses ts-node for direct TypeScript execution
- Production mode requires build step before running

## Current Implementation Status
The project is in early development phase with basic API connection and task retrieval functionality implemented.