
# Coding standards

This document describes our coding standards. These are based on the [TypeScript coding guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines) and on the conventions used throughout the packages in this monorepo.

We use the latest [ECMAScript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) features of JavaScript as much as possible. TypeScript is primarily used for type checking.

The first part of this document contains the rules that apply to all packages. The last chapter contains additional rules per package.

## Names

1. Use PascalCase for type names.
1. Do not use I as a prefix for interface names.
1. Use PascalCase for enum values.
1. Use camelCase for function names.
1. Use camelCase for property names and local variables.
1. Use JavaScript private (#) for private properties and functions (e.g. `#rootLocation`, `#validateLocation()`).
1. Use UPPER_SNAKE_CASE for the keys of constant objects (e.g. `StatusCodes.NOT_FOUND`).
1. Use whole words in names when possible.
1. Name error classes after the situation they describe, without an `Error` suffix (e.g. `ProcedureNotFound`, `InvalidLocation`, `StartingServerFailed`).

## Files and components

1. 1 file per logical component (class, interface, type, error or definition).
1. The file name equals the name of its default export (e.g. `FileManager.ts` contains `FileManager`).
1. Group files by kind in dedicated folders within a (sub) module:
    - `definitions/` for constants and their derived types.
    - `errors/` for error classes.
    - `interfaces/` for interfaces.
    - `models/` for domain models.
    - `types/` for shared types.
    - `utils/` for utility classes.
1. Every (sub) module has an `index.ts` file that re-exports its public members.

## Exports

1. Use `export default` for classes, interfaces, types and constant objects.
1. Index files re-export using the `export { default as <Name> } from './<Name>';` pattern.
1. Use `export type` / `export { type ... }` for type-only exports.
1. Do not export types/functions unless you need to share them across multiple components.
1. Do not introduce new types/values to the global namespace.
1. Public members of a package must be exported via its `src/index.ts`.

```ts
export { default as States, type State } from './definitions/States';
export { default as Middleware } from './interfaces/Middleware';
export { default as MiddlewareManager } from './MiddlewareManager';
```

## Types

1. Shared types should be defined in a types folder.
1. Getters never define their return types. Getter signatures in interfaces are the exception, because they have no body to infer from.
1. Functions always define their return type.
1. Define constants as a `const` object with `as const`, and derive the type from it.
1. Configuration types are object types with `readonly` (mostly optional) fields.

```ts
const RunModes =
{
    NORMAL: 'normal',
    DRY: 'dry'
} as const;

type RunMode = typeof RunModes[keyof typeof RunModes];

export default RunModes;
export type { RunMode };
```

## Classes

1. Declare private fields at the top of the class body.
1. Declare fields as `readonly` when they are not reassigned (e.g. `readonly #name: string;`).
1. Expose private fields through getters (e.g. `get name() { return this.#name; }`).
1. Receive dependencies through the constructor instead of creating collaborators inside methods.
1. Use the `??` operator to apply default values (e.g. `configuration.port ?? Defaults.PORT`).

## Imports

1. External dependencies should be defined first.
1. Core dependencies should be defined second.
1. Runtime dependencies should be defined third.
1. Types should be imported last.
1. Imports per import block are sorted alphabetically.
1. Use workspace aliases (`@jitar/...`) for imports from other packages. Never use relative paths across `packages/`.
1. Use relative paths for imports within the same package.
1. Use `import type` for type-only imports.

## null and undefined

1. Use undefined. Do not use null unless the external library requires it.

## Errors

1. Every error class is a default exported class in its own file in an `errors/` folder, close to the code that throws it.
1. Errors that can reach a caller of a procedure extend the matching base error from `@jitar/errors` (e.g. `ProcedureNotFound extends NotFound`). This allows the runtime to translate it to the right status code.
1. Other errors extend `Error` directly.
1. Errors that wrap another error pass it as cause: `super('Starting server failed', { cause });`.
1. Do not add properties to errors unless the error carries data that the caller needs. Expose that data through getters.

## Error messages

1. Use indefinite articles for indefinite entities.
1. Definite entities should be named (this is for a variable name, type name, etc..).
1. Wrap named values in single quotes (e.g. `Procedure '${fqn}' not found`).
1. When stating a rule, the subject should be in the singular (e.g. "An external module cannot..." instead of "External modules cannot...").
1. Use present tense.

## General Assumptions

1. Consider objects as immutable outside the component that created them. Do not change them.
1. Consider arrays as immutable by default after creation.
1. Use encapsulation as much as possible.

## Comments

1. Only use `//` for comments.
1. Use comments sparsely.
1. Do not use comments to explain the code (the what), but can be used to explain the why.

## Strings

1. Use single quotes for strings.
1. Use backticks with variables instead of string concatenation.

## General Constructs

1. Try to use `.map` and `.filter` instead of loops when it is not strongly inconvenient. Use `for...of` when a loop is needed.
1. Do not nest loops, but create new functions for inner loops.
1. Use arrow functions over anonymous function expressions.

## Style

Readability is the most important part of coding. Below are some of the ground rules to keep the code readable.

Code may contain a lot of empty rows, as we prefer to group logical steps together and separate them from other steps in the function.

1. Every file starts with an empty line.
1. Every file ends with a newline.
1. Always end statements with a semicolon.
1. Always use brackets for if statements, even if there is just one line of code within.
1. Use brackets for else statements, except when the only statement is an if.
1. When using the ternary operators, the ? and the : begin on a new line with indentation, if the result would be a very long statement otherwise.
1. Only surround arrow function parameters when necessary.
1. Always surround loop and conditional bodies with curly braces.
1. Open curly braces always go on the next line as whatever necessitates them (Allman style). Simple bodies may stay on a single line (e.g. getters).
1. Parenthesized constructs should have no surrounding whitespace.
1. A single space follows commas, colons, and semicolons in those constructs.
1. Use a single declaration per variable statement.
1. else goes on a separate line from the closing curly brace.
1. Use 4 spaces per indentation.

## Linting

The linting rules are defined in the root `eslint.config.mjs` and run with `npm run lint`. The `--fix` option is not supported, so issues need to be fixed manually.

1. Always run `npm run lint` after modifying TypeScript files.
1. Never disable ESLint rules with inline comments without explicit approval.
1. The only accepted exception is `@typescript-eslint/no-unused-vars` for parameters that an interface requires, but the implementation does not use.

## Testing

1. Tests use [Vitest](https://vitest.dev) with the `v8` coverage provider.
1. Tests live in the `test/` folder of the package and mirror the `src/` structure.
1. Name test files `<ComponentName>.spec.ts`.
1. Place test data in a `fixtures/` folder next to the tests, with an `index.ts` that re-exports all fixtures.
1. Name fixture files `<name>.fixture.ts` and export the fixtures as UPPER_SNAKE_CASE named constants (e.g. `SEGMENTS.GENERAL`).
1. Use `describe('<ClassName>')` for the class, `describe('.<methodName>(<params>)')` per method and `it('should <behavior>')` per case.
1. Use `await expect(promise).rejects.toEqual(new <ErrorClass>(...))` for asserting errors.

## Code formatter

A large portion of the formatting can be done by the tools we use. Below are additions to the default settings of Visual Studio Code.

The settings can be edited via Preference > Settings.

```json
{
    "[typescript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features",
        "editor.formatOnSave": true
    },
    "[json]": {
        "editor.defaultFormatter": "vscode.json-language-features",
        "editor.formatOnSave": true
    },
    "typescript.updateImportsOnFileMove.enabled": "always",
    "typescript.format.placeOpenBraceOnNewLineForFunctions": true,
    "typescript.format.placeOpenBraceOnNewLineForControlBlocks": true,
    "typescript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": false,
    "typescript.format.insertSpaceAfterTypeAssertion": true
}
```

## Code examples

Statements are grouped together based on logic separation. The example below puts the steps related to reading the proxy object together.

```ts
constructor(app: express.Application, proxy: Proxy, logger: Logger)
{
    this.#logger = logger;

    this.#repositoryUrl = proxy.repository.url ?? '';
    this.#runnerUrl = proxy.runner.url ?? '';

    app.use('/', expressProxy((message: IncomingMessage): string => this.#selectProxy(message)));
}
```

Examples of ternary operator use with long and short statement.

```ts
const segmentNames = configuration.segments.length === 0
    ? await this.#getSegmentNames(configuration.cache)
    : configuration.segments;

const message = error instanceof Error ? error.message : String(error);
```

The preferred way to concatenate strings together.

```ts
const url = `${this.#url}/nodes`;
```

An error class that carries data.

```ts
import { NotFound } from '@jitar/errors';

export default class ProcedureNotFound extends NotFound
{
    readonly #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}
```

An error class that wraps another error.

```ts
export default class StartingServerFailed extends Error
{
    constructor(cause: unknown)
    {
        super('Starting server failed', { cause });
    }
}
```
