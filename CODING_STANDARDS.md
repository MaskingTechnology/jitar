
# Coding standards

This document describes our coding standards. These are based on the [TypeScript coding guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines).

We use the latest [ECMAScript](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/) features of JavaScript as much as possible. Typescript is primarily used for type checking.

## Names

1. Use PascalCase for type names.
1. Do not use I as a prefix for interface names.
1. Use PascalCase for enum values.
1. Use camelCase for function names.
1. Use camelCase for property names and local variables.
1. Use JavaScript private (#) for private properties and functions.
1. Use whole words in names when possible.

## Components

1. 1 file per logical component (e.g. parser, scanner, emitter, checker).

## Types

1. Do not export types/functions unless you need to share it across multiple components.
1. Do not introduce new types/values to the global namespace.
1. Shared types should be defined in a types folder.
1. Getters never define their return types.
1. Functions always define their return type.

## Imports

1. External dependencies should be defined first.
1. Core dependencies should be defined second.
1. Runtime dependencies should be defined third.
1. Types should be imported last.
1. Imports per import block are sorted alphabetically.

## null and undefined

1. Use undefined. Do not use null unless the external library requires it.

## General Assumptions

1. Consider objects like Nodes, Symbols, etc. as immutable outside the component that created them. Do not change them.
1. Consider arrays as immutable by default after creation.
1. Use encapsulation as much as possible.

## Flags

1. More than 2 related Boolean properties on a type should be turned into a flag.

## Comments

1. Only use `//` for comments.
1. Use comments sparsely.
1. Do not use comments to explain the code (the what), but can be used to explain the why.

## Strings

1. Use single quotes for strings.
1. Use backticks with variables instead of string concatenation.
1. All strings visible to the user need to be localized (make an entry in diagnosticMessages.json).

## Error Messages

1. Use indefinite articles for indefinite entities.
1. Definite entities should be named (this is for a variable name, type name, etc..).
1. When stating a rule, the subject should be in the singular (e.g. "An external module cannot..." instead of "External modules cannot...").
1. Use present tense.

## General Constructs

For a variety of reasons, we avoid certain constructs, and use some of our own. Among them:

1. Do not use ts.forEach, ts.forEachKey and ts.forEachValue.
1. Try to use .forEach, .map, and .filter instead of loops when it is not strongly inconvenient.
1. Do not nest loops, but create new functions for inner loops.

## Style

Readability is the most important part of coding. Below are some of the ground rules to keep the code readable.

Code may contain a lot of empty rows, as we prefer to group logical steps together and seperate them from other steps in the function.

1. Always use brackets for if statements, even if there is just one line of code within.
1. Use brackets for else statements, except when the only statement is an if.
1. When using the ternary operators, the ? and the : begin on a new line with indentation, if the result would be a very long statement otherwise.
1. Use arrow functions over anonymous function expressions.
1. Only surround arrow function parameters when necessary.
1. Always surround loop and conditional bodies with curly braces.
1. Open curly braces always go on the next line as whatever necessitates them.
1. Parenthesized constructs should have no surrounding whitespace.
1. A single space follows commas, colons, and semicolons in those constructs.
1. Use a single declaration per variable statement.
1. else goes on a separate line from the closing curly brace.
1. Use 4 spaces per indentation.

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