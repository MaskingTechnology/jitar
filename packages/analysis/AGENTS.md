# Analysis Package Agent Guidelines

## Purpose

This package provides application analysis tools for the Jitar runtime. It offers two complementary approaches to analyzing JavaScript/TypeScript code:

- **Reflector** — Runtime reflection (modules, classes, functions, objects, and instances)
- **Parser** — Static code parsing (modules, statements, imports, exports, variables, functions, and classes)

Both tools return models based on the ECMAScript specification, tailored to the Jitar runtime.

## Package Structure

```
src/
├── index.ts                    # Main entry point — re-exports from model, dynamic, static
├── model/                      # ECMAScript-based model classes (30+ classes)
│   ├── ESModule.ts             # Module-level container with statements
│   ├── ESClass.ts              # Class model with members (fields, methods, getters, setters)
│   ├── ESClassMember.ts        # Abstract base for class members
│   ├── ESVariable.ts           # Variable declarations (const, let, var)
│   ├── ESFunction.ts           # Function models (regular, arrow, generator)
│   ├── ESBinding.ts            # Binding models (identifier, array, object)
│   ├── ESExport.ts             # Export statements
│   ├── ESImport.ts             # Import statements
│   ├── ESExpression.ts         # Expression model (reconstructable code)
│   └── ... (26+ model classes)
├── dynamic/                    # Runtime reflection tools
│   ├── Reflector.ts            # Reflect on runtime objects to create ES models
│   ├── ClassMerger.ts          # Merge class hierarchies for inheritance
│   └── index.ts
└── static/                     # Static code analysis tools
    ├── Parser.ts               # Parse JavaScript/TypeScript code into ES models
    ├── Lexer.ts                # Tokenize code into tokens
    ├── Coder.ts                # Reconstruct code from models
    ├── definitions/            # Token definitions (keywords, dividers, operators, etc.)
    ├── errors/                 # Custom error classes (ExpectedToken, etc.)
    └── models/                 # Token, TokenList, CharList, ItemList
```

## Core Concepts

### Three Layers of Analysis

1. **Lexer (Tokenization)** — Breaks source code into tokens (keywords, literals, operators, etc.)
   - `Lexer.tokenize(code: string): TokenList`
   - Skips whitespace and comments
   - Handles numbers, strings, regex, operators, keywords

2. **Parser (Parsing)** — Consumes tokens and builds ES model trees
   - `Parser.parse(code: string): ESModule`
   - `Parser.parseClass(code: string): ESClass`
   - `Parser.parseFunction(code: string): ESFunction`
   - `Parser.parseImport/Export/Variable/Statement(code: string): ...`

3. **Reflector (Reflection)** — Reflects on runtime objects to create ES models
   - `Reflector.fromModule(module: object): ESModule`
   - `Reflector.fromClass(clazz: Function): ESClass`
   - `Reflector.fromObject(object: object): ESClass`
   - `Reflector.fromFunction(function: Function): ESFunction`

### Model Hierarchy

All model classes follow a consistent pattern:

```
ESStatement (abstract)
├── ESDeclaration (abstract)
│   ├── ESVariable
│   ├── ESFunction / ESArrowFunction / ESGeneratorFunction
│   └── ESClass
├── ESExpression
├── ESImport
├── ESExport
└── ESBinding (abstract)
    ├── ESIdentifierBinding
    ├── ESPropertyBinding
    ├── ESArrayBinding
    └── ESObjectBinding
```

Class members extend `ESClassMember` (abstract):

```
ESClassMember (abstract)
├── ESField
├── ESConstructor
├── ESMethod / ESGeneratorMethod
├── ESGetter
└── ESSetter
```

## Naming Conventions

### Model Classes
- All model classes start with the `ES` prefix (e.g., `ESModule`, `ESClass`, `ESVariable`)
- Abstract base classes also use the `ES` prefix (e.g., `ESStatement`, `ESClassMember`)
- Use `export default class` for the class definition

### Static Analysis Classes
- `Lexer`, `Parser`, `Coder` — core analysis tools
- `Token`, `TokenList`, `CharList`, `ItemList` — data structures
- Definition types: `Keyword`, `Divider`, `Operator`, `List`, `Group`, `Scope`, `Punctuation`, `Literal`, `Boolean`, `Number`, `Whitespace`, `Comment`, `Empty`, `Indicator`, `TokenType`

### Dynamic Analysis Classes
- `Reflector` — runtime reflection tool
- `ClassMerger` — merges class hierarchies

### Error Classes
- Use `export default class` extending `Error`
- Prefix error names with `Expected` or `Unexpected` (e.g., `ExpectedToken`, `UnexpectedKeyword`)

### Type Exports
- Use `export type` for type-only exports in index files
- Re-export types with custom names when needed (e.g., `export type { Visibility as ClassVisibility }`)

### Test Fixtures
- Name fixture files as `*.fixture.ts`
- Export fixtures as named constants (e.g., `export const CLASSES = { ... }`)

## Export Patterns

### Index Files
Re-export all public types and classes using `export { default as ClassName } from './ClassName'`:

```ts
export { default as ESModule } from './ESModule';
export { default as Parser } from './Parser';
export type { Visibility as ClassVisibility } from './ESClassMember';
```

### Main Entry Point (`src/index.ts`)
Group related exports together:

```ts
export { ESBinding, ESVariable, ESFunction, ESClass, ... } from './model';
export { Reflector } from './dynamic';
export { Parser } from './static';
```

## Writing Model Classes

Every model class must:

1. Use `export default class`
2. Have a `clone()` method returning a deep copy of the instance
3. Have a `toString()` method:
   - `toString()` — returns the full string representation
   - `toString(terminate: boolean)` — controls whether to add semicolons
4. Use the `#` prefix for private fields and methods
5. Use public readonly properties for read-only accessors
6. Use getter properties for computed/filtering accessors (e.g., `get fields()`, `get methods()`)

Example:

```ts
export default class ESField extends ESClassMember
{
    initializer: ESExpression | undefined;

    constructor(identifier: string, visibility: Visibility, location: Location, initializer: ESExpression | undefined)
    {
        super(identifier, visibility, location);
        this.initializer = initializer;
    }

    clone(): ESField
    {
        return new ESField(
            this.identifier,
            this.visibility,
            this.location,
            this.initializer?.clone()
        );
    }

    toString(): string
    {
        const initializer = this.initializer !== undefined ? ` = ${this.initializer.toString(true)}` : '';
        const accessModifier = this.visibility === 'public' ? 'public ' : '';
        const staticKeyword = this.location === 'static' ? 'static ' : '';

        return `${staticKeyword}${accessModifier}field ${this.identifier}${initializer};`;
    }
}
```

## Writing Tests

### Test File Structure
- Name test files as `*.spec.ts`
- Place tests in `test/<category>/` directories matching source structure
- Use vitest: `import { describe, expect, it } from 'vitest'`

### Test Organization
- Use `describe('ClassName')` for class-level tests
- Use `describe('.methodName(params)')` for method-level tests
- Use `it('should <behavior>')` for individual test cases

### Test Patterns
- Create shared instances at the top of the describe block (e.g., `const parser = new Parser();`)
- Use fixtures imported from `./fixtures` for test data
- Assert on both the instance type (`toBeInstanceOf`) and property values (`toEqual`, `toHaveLength`)

Example:

```ts
import { describe, expect, it } from 'vitest';
import { Parser } from '../../src/static';
import { CLASSES } from './fixtures';

const parser = new Parser();

describe('Parser', () =>
{
    describe('.parseClass(code)', () =>
    {
        it('should parse a class with fields and methods', () =>
        {
            const parsed = parser.parseClass(CLASSES.BASIC);
            expect(parsed).toBeInstanceOf(ESClass);
            expect(parsed.identifier).toEqual('MyClass');
            expect(parsed.fields).toHaveLength(2);
            expect(parsed.methods).toHaveLength(1);
        });
    });
});
```

## Known Limitations (Parser)

The parser has the following known limitations:

1. **Generator methods as object properties** — Dynamic property generators (e.g., `*[Symbol.iterator]()`) are not supported. Named generator methods (static, async, instance) are supported.

2. **Dynamic property destructuring** — Dynamic property destructuring (e.g., `const { [key]: value } = obj`) is not yet supported.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package |
| `npm run lint` | Lint the package (must pass before merging) |
| `npm run test` | Run all tests |
| `npm run test-coverage` | Run tests with coverage report |
| `npm run clean` | Remove `dist/` directory |

Always run `npm run lint` after modifying TypeScript files. A full monorepo build (`npm run build:all`) must pass before merging or publishing.

## Import Conventions

- Import from within the monorepo using workspace aliases (`@jitar/...`)
- Import sibling package modules using relative paths (e.g., `../model`, `../../src/static`)
- Use `import type` for type-only imports to avoid runtime overhead

## Error Handling

The static analysis tools throw custom error classes:

- `ExpectedToken(value, position)` — Expected a specific token at a position
- `UnexpectedToken(value, position)` — Unexpected token found at a position
- `ExpectedKeyword(keyword, position)` — Expected a specific keyword at a position
- `UnexpectedKeyword(keyword, position)` — Unexpected keyword found at a position
- `UnexpectedParseResult(expected)` — Parser returned an unexpected type

All errors include descriptive messages with position information.

## MCP Usage

### Github

When using this MCP, the `repo` is `jitar` and the `owner` is `MaskingTechnology`.

- don't use this MCP for reading code
- when an issue number is provided (i.e. #813) use the `read issue` functionality.
