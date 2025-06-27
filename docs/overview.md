# Project Overview

**tdt** is a Node.js TypeScript CLI application for Todoist API integration, focusing on task management with functional programming principles.

## Core Technologies
- **Language**: TypeScript 5.8+
- **Runtime**: Node.js 24+
- **Package Manager**: pnpm 10.12+

## Build Configuration
- **TypeScript**: Strict mode enabled, ESM modules, bundler module resolution
- **Development**: ts-node for direct TypeScript execution
- **Production**: Compiled to dist/ with TypeScript compiler

## Testing
- **Test Runner**: Vitest with in-source testing
- **Coverage**: @vitest/coverage-v8
- **Strategy**: Test-driven development (TDD) following t-wada's approach

## Code Quality
- **Linter**: oxlint (Rust-based, high performance)
- **Configuration**: .oxlintrc.json with promise, import, and node plugins
- **CI Integration**: Linting runs on every commit

## Error Handling
- **Strategy**: neverthrow for Result types
- **Policy**: Strict no-exceptions design
- **Pattern**: All fallible functions return `Result<T, E>`

## Domain Architecture
- **Pattern**: Functional domain modeling
- **Structure**: 
  - `src/core/` - Pure domain models and business logic
  - `src/infra/` - Infrastructure and side effects
  - `src/app/` - Application layer
- **Types**: Branded types for type safety (TaskId, ProjectId, etc.)
- **Logic**: Pure functions, algebraic data types

## External Dependencies
- **Todoist API**: @doist/todoist-api-typescript for API integration
- **Environment**: dotenv for development configuration
- **Validation**: Zod for type-safe data validation
- **Utilities**: cross-env for cross-platform environment variables

## Development Workflow
- **Commands**: 
  - `pnpm dev` - Development mode
  - `pnpm build` - Production build
  - `pnpm test` - Run tests
  - `pnpm lint` - Lint code
  - `pnpm check` - Full validation (typecheck + test + lint)

## CI/CD
- **Platform**: GitHub Actions
- **Checks**: Lint → Typecheck → Test
- **Node Version**: 24
- **Cache**: pnpm dependencies cached

---

*This project was bootstrapped from [ts-guide](https://github.com/mizchi/ts-guide) and ejected on 2024-12-27.*