# Monorepo Agent Guidelines

## Repository Structure
- `packages/analysis`: Application analysis library for the Jitar runtime, providing code analysis and introspection capabilities.
- `packages/build`: Application building library for the Jitar runtime, handling the build process and configuration.
- `packages/cli`: Command-line interface for scaffolding, building, and managing Jitar applications.
- `packages/configuration`: Configuration management library for loading, parsing, and validating application settings.
- `packages/errors`: Error types and utilities for the Jitar runtime, including custom error classes (BadRequest, NotFound, ServerError, etc.).
- `packages/execution`: Core execution engine for running procedures, handling requests, responses, segments, and implementations.
- `packages/health`: Health check monitoring for Jitar runtime components and services.
- `packages/http`: HTTP transport layer for Jitar, providing HTTP remoting and remote builder capabilities.
- `packages/init`: Project initialization and scaffolding tool for creating new Jitar applications from templates.
- `packages/jitar`: The main Jitar package — a re-export umbrella that provides a single entry point to all core runtime features (CLI, client, and library exports).
- `packages/logging`: Logging utilities and logger implementations for the Jitar runtime.
- `packages/middleware`: Middleware pipeline system for intercepting and processing requests within Jitar.
- `packages/plugin-vite`: Vite plugin for integrating Jitar with the Vite build and development toolchain.
- `packages/runtime`: Runtime infrastructure for Jitar, including client builders, server management, and service lifecycle.
- `packages/scheduling`: Scheduling library for managing timed tasks and deferred executions within the Jitar runtime.
- `packages/serialization`: Serialization library for the Jitar runtime, providing serialization/deserialization of values, objects, and custom types.
- `packages/services`: Service layer for Jitar, providing runner services (Worker, Gateway) and provider services (Repository) for executing procedures and serving files.
- `packages/sourcing`: Application sourcing library for file and module management, including file managers and module importers.
- `packages/validation`: Data validation library for the Jitar runtime, providing validation schemes and validators.

## Global Skills
- Shared workflows live in `.agents/skills/<skill-name>`

## Package-Specific Context
When working within a specific package under `packages/*`, refer to:
1. `packages/<package>/AGENTS.md` for package-level instructions
2. `packages/<package>/.agents/skills/` for specialized domain skills

## Linting & Code Quality

- **Configuration:** Source of truth is defined in the root `eslint.config.js`.
- **Commands:**
  - Check linting: `npm run lint`
  - Auto-fix issues: `npm run lint -- --fix`
- **Rules to Keep in Mind:**
  - Never disable ESLint rules with inline comments (`// eslint-disable-next-line`) without explicit approval.
  - All package imports within the monorepo must use workspace aliases (`@jitar/...`), not relative paths across `packages/`.
- **Requirement:** Always run `npm run lint` after modifying TypeScript files to verify clean code formatting.