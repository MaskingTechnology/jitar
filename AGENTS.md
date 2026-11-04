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