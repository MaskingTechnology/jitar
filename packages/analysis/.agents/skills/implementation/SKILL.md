---
name: implementation
description: Implement new features in the Jitar analysis package (Reflector and Parser). Use when adding functionality to the static or dynamic analysis tools, extending the ECMAScript model, or implementing new parsing capabilities.
---

# Implementation

## Overview

This skill guides the implementation of new features in the Jitar analysis package. The package provides two complementary analysis approaches:

- **Reflector** (dynamic) — Runtime reflection on JavaScript/TypeScript objects to create ES models
- **Parser** (static) — Static code parsing that tokenizes and parses source code into ES models

Both tools return models based on the ECMAScript specification, tailored to the Jitar runtime. This skill covers adding new model classes, extending the Lexer/Parser, or adding new Reflector methods.

## When to Use

Invoke this skill when asked to:

- Add a new ES model class (e.g., a new statement type, declaration, or binding)
- Extend the Parser with new parsing capabilities
- Add new token definitions for the Lexer
- Implement new Reflector methods
- Add unit tests for existing or new functionality
- Fix bugs in the Lexer, Parser, or Reflector

## Pre-Implementation Checklist

Before writing code:

## Implementation Guidelines

### 1. Adding a New Model Class

Every model class must follow these conventions:

```ts
// File: src/model/ESNewClass.ts

export default class ESNewClass extends ESStatement
{
    // Use # prefix for private fields
    #privateField: string;

    // Public readonly properties for read-only accessors
    publicProperty: string;

    constructor(value: string)
    {
        super();
        this.#privateField = value;
        this.publicProperty = value;
    }

    // MUST implement clone() returning a deep copy
    clone(): ESNewClass
    {
        return new ESNewClass(this.#privateField);
    }

    // MUST implement toString() with optional terminate parameter
    toString(): string
    {
        return `newClass(${this.#privateField});`;
    }

    toString(terminate: boolean): string
    {
        const suffix = terminate ? ';' : '';
        return `${this.toString()}${suffix}`;
    }

    // Use getter properties for computed/filtering accessors
    get computedValue(): string
    {
        return this.#privateField.toUpperCase();
    }
}
```

**Rules:**

### 2. Extending the Parser

When adding new parsing capabilities:

```ts
// In Parser.ts

parseNewFeature(code: string): ESNewClass
{
    const tokens = this.lexer.tokenize(code);
    // ... parsing logic using token definitions
}
```

**Rules:**

- Use the existing token definitions from `src/static/definitions/`
- Throw custom error classes for unexpected input (see Error Handling below)
- Return the appropriate ES model instance
- Follow the existing parsing patterns (token consumption, position tracking)

### 3. Adding Lexer Definitions

When new tokens are needed:

```ts
// In definitions/Keyword.ts or definitions/Operator.ts

export const NEW_KEYWORD: Keyword = {
    value: 'newKeyword',
    type: TokenType.KEYWORD,
};
```

**Rules:**

- Use the existing definition types: `Keyword`, `Divider`, `Operator`, `List`, `Group`, `Scope`, `Punctuation`, `Literal`, `Boolean`, `Number`, `Whitespace`, `Comment`, `Empty`, `Indicator`, `TokenType`
- Add to the appropriate definition file
- Export from the definitions index

### 4. Adding Reflector Methods

When extending runtime reflection:

```ts
// In Reflector.ts

fromNewFeature(object: object): ESNewClass
{
    // Reflect on runtime object to create ES model
}
```

**Rules:**

### 5. Writing Tests

Test files follow these conventions:

```ts
// File: test/model/ESNewClass.spec.ts

import { describe, expect, it } from 'vitest';
import ESNewClass from '../../src/model/ESNewClass';

describe('ESNewClass', () =>
{
    describe('.constructor(value)', () =>
    {
        it('should create an instance with the given value', () =>
        {
            const instance = new ESNewClass('test');
            expect(instance).toBeInstanceOf(ESNewClass);
        });
    });

    describe('.clone()', () =>
    {
        it('should return a deep copy', () =>
        {
            const original = new ESNewClass('test');
            const cloned = original.clone();
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
        });
    });
});
```

**Rules:**

- Name test files as `*.spec.ts`
- Place tests in `test/<category>/` directories matching source structure
- Use `describe('ClassName')` for class-level tests
- Use `describe('.methodName(params)')` for method-level tests
- Use `it('should <behavior>')` for individual test cases
- Create shared instances at the top of the describe block
- Assert on both the instance type (`toBeInstanceOf`) and property values (`toEqual`, `toHaveLength`)

### 6. Updating Exports

After adding a new class or method:

```ts
// In src/index.ts or the relevant index.ts

export { default as ESNewClass } from './model/ESNewClass';
export type { Visibility as ClassVisibility } from './model/ESClassMember';
```

**Rules:**

## Error Handling

The static analysis tools throw custom error classes:

| Error Class | When to Use |
|-------------|-------------|
| `ExpectedToken(value, position)` | Expected a specific token at a position |
| `UnexpectedToken(value, position)` | Unexpected token found at a position |
| `ExpectedKeyword(keyword, position)` | Expected a specific keyword at a position |
| `UnexpectedKeyword(keyword, position)` | Unexpected keyword found at a position |
| `UnexpectedParseResult(expected)` | Parser returned an unexpected type |

**Rules:**

- Use `export default class` extending `Error`
- Prefix error names with `Expected` or `Unexpected`
- Include descriptive messages with position information

## Known Limitations

Be aware of these known parser limitations before implementing:

1. **Generator methods as object properties** — Dynamic property generators (e.g., `*[Symbol.iterator]()`) are not supported. Named generator methods (static, async, instance) are supported.

2. **Destructuring with aliases** — Destructuring with aliases (e.g., `const { b: c } = obj`) is not yet supported.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package |
| `npm run lint` | Lint the package (must pass before merging) |
| `npm run test` | Run all tests |
| `npm run test-coverage` | Run tests with coverage report |
| `npm run clean` | Remove `dist/` directory |

**Important:** Always run `npm run lint` after modifying TypeScript files. A full monorepo build (`npm run build:all`) must pass before merging or publishing.

## Import Conventions

- Import from within the monorepo using workspace aliases (`@jitar/...`)
- Import sibling package modules using relative paths (e.g., `../model`, `../../src/static`)
- Use `import type` for type-only imports to avoid runtime overhead

## Post-Implementation Checklist

After implementing a feature:

- [ ] All TypeScript strict mode checks pass (no unjustified `any`, no new `as` assertions)
- [ ] Code style matches conventions (single quotes, semicolons, Allman brace style)
- [ ] One leading blank line at top of file, one blank line after imports, one trailing blank line at EOF
- [ ] No unused variables/imports, no stray `console.*` calls (use the shared `logger`)
- [ ] All unit tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Full monorepo build passes (`npm run build:all`)
- [ ] New functionality is documented in AGENTS.md if it affects the public API