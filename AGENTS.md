# Monorepo Agent Guidelines

## Repository Structure
- `packages/analysis`: application analysis tools
- `packages/build`: build tools

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