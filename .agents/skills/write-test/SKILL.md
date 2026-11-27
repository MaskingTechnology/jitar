---
name: write-test
description: Write, update, or validate Vitest tests (`*.spec.ts`) and fixtures (`*.fixture.ts`) for a package under `packages/*`. Use when adding tests for new or changed code, fixing failing tests, or checking that existing tests follow the Jitar test conventions.
---

# Write Tests

## Overview

Every package with a `vitest.config.ts` keeps its tests in `test/` next to `src/`. Tests are plain Vitest unit tests driven by **fixtures**: spec files contain only the scenarios and assertions, and all instances, inputs, expected outputs and test doubles live in fixture files.

The general rules are in [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md) → Testing. This skill describes how those rules are applied across the packages. Also read the package's own `AGENTS.md` for package-specific notes (for example, the Temporal flag in `serialization`).

Good reference packages:

| Pattern | Example |
| --- | --- |
| Simple class with fixtures | `packages/validation/test/`, `packages/cli/test/` |
| Sub-folders mirroring `src/` | `packages/execution/test/`, `packages/serialization/test/` |
| Round-trip (input ⇄ output) fixtures | `packages/serialization/test/serializers/` |
| Test doubles for interfaces | `packages/services/test/gateway/fixtures/remotes.fixture.ts`, `packages/http/test/fixtures/TestHttpClient.ts` |
| Mutable fixture + `beforeEach` | `packages/logging/test/` |
| Cross-package dependencies (`@jitar/...`) | `packages/services/test/worker/` |

## Running Tests

Run these from the package directory (`packages/<package>`):

| Command | Purpose |
| --- | --- |
| `npm run test` | Run all tests of the package (`vitest run`) |
| `npx vitest run test/<path>/<Name>.spec.ts` | Run a single spec file |
| `npm run test-coverage` | Run with the `v8` coverage report |

From the repository root, `npm run test` runs all packages through Turbo, and `npm run review` runs tests and lint. Tests import from `src/` directly, so you don't need to build the package under test. You do need to build its `@jitar/*` dependencies (`npm run build:all`) when the test imports them.

## File Organization

The `test/` folder mirrors the `src/` folder. Each folder that has spec files has its own `fixtures/` folder:

```
packages/execution/
  src/
    ExecutionManager.ts
    models/Segment.ts
    utils/VersionParser.ts
  test/
    ExecutionManager.spec.ts
    fixtures/
      index.ts
      executionManagers.fixture.ts
    models/
      Segment.spec.ts
      fixtures/
        index.ts
        procedures.fixture.ts
        segments.fixture.ts
    utils/
      VersionParser.spec.ts
      fixtures/
        index.ts
        versions.fixture.ts
```

| File | Naming |
| --- | --- |
| Spec | `<ComponentName>.spec.ts`, using the same name as the source file it tests |
| Fixture module | `<plural camelCase subject>.fixture.ts`, e.g. `segments.fixture.ts`, `localWorkers.fixture.ts`, `values.fixture.ts` |
| Test double class | `Test<Name>.ts`, e.g. `TestFileSystem.ts`, or a class inside a fixture module |
| Fixture index | `fixtures/index.ts` |

### Fixture index

`fixtures/index.ts` re-exports every fixture module, in alphabetical order:

```ts

export * from './applications.fixture';
export * from './procedures.fixture';
export * from './segments.fixture';
```

Spec files only import fixtures from `'./fixtures'`, never from an individual fixture module.

### Packages without tests

A package that has a test script but no tests yet keeps a placeholder so `vitest run` does not fail (see `packages/runtime/test/dummy.spec.ts`). Replace it when you add real tests:

```ts

import { describe, expect, it } from 'vitest';

describe('dummy', () =>
{
    // TODO: Add real tests

    it('should not complain about missing tests', async () =>
    {
        expect(true).toBeTruthy();
    });
});
```

## Spec Files

### Template

```ts

import { describe, expect, it } from 'vitest';

import { Request, Version, ProcedureNotFound, RunModes } from '@jitar/execution';

import RequestNotTrusted from '../../src/worker/errors/RequestNotTrusted';

import { LOCAL_WORKERS, VALUES } from './fixtures';

const protectedWorker = LOCAL_WORKERS.PROTECTED;

describe('worker/LocalWorker', () =>
{
    describe('.run(request)', () =>
    {
        it('should run a protected procedure with valid trust key', async () =>
        {
            const headers = new Map().set(VALUES.TRUST_KEY_HEADER, VALUES.TRUST_KEY);
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const response = await protectedWorker.run(request);

            expect(response.result).toBe('protected');
        });

        it('should not run a protected procedure with invalid trust key', async () =>
        {
            const headers = new Map().set(VALUES.TRUST_KEY_HEADER, 'invalid');
            const request = new Request('protected', Version.DEFAULT, new Map(), headers, RunModes.NORMAL);

            const promise = protectedWorker.run(request);

            await expect(promise).rejects.toEqual(new RequestNotTrusted());
        });
    });
});
```

### Imports

Order the import groups like this, with a blank line between groups:

1. `vitest`: only the functions you use (`describe`, `expect`, `it`, plus `beforeEach` or `vi` when needed).
2. Other monorepo packages through their workspace alias (`@jitar/execution`, `@jitar/sourcing`, ...). Never use a relative path into another package.
3. The package's own source, through a relative path into `src/`: `'../src/...'` from `test/`, `'../../src/...'` from `test/<folder>/`, and so on. You may import from the package index (`'../src'`) when the component is exported there.
4. Fixtures from `'./fixtures'`.

For a type-only default export, use `import type Segment from '../src/models/Segment';`. For named type-only imports, use inline `type` modifiers (`import { type Foo } from '...'`).

### Describe and it naming

- **Top-level `describe`**: the component name. If the spec lives in a sub-folder of `test/`, prefix it with that folder: `'ExecutionManager'`, `'models/Segment'`, `'serializers/MapSerializer'`, `'worker/LocalWorker'`.
- **Nested `describe`**: one per public member, in the order they appear in the class.
  - Method: `'.methodName(paramName, ...)'`, e.g. `'.run(request)'`, `'.serialize(map)'`, `'.getExposedProcedures()'`.
  - Getter or property: `'.propertyName'`.
- **Optional grouping `describe`**: for a cross-cutting variant, add an extra level above the methods, e.g. `describe('POSIX')` and `describe('Windows')` in `sourcing/test/FileManager.spec.ts`, or `describe('Statements')` in `analysis/test/static/Parser.spec.ts`.
- **`it`**: always `'should <expected behavior>'`. Phrase negative cases as `'should not ...'` or `'should throw ... when ...'`.

### Shared instances

Do not construct the system under test inside a spec. Build it in a fixture, then alias it in a module-level constant at the top of the spec:

```ts
const executionManager = EXECUTION_MANAGERS.GENERAL;
const generalSegment = SEGMENTS.GENERAL;
```

When an instance is only relevant to one method, alias it inside that method's `describe`:

```ts
describe('.debug(...message)', () =>
{
    const debugLogger = LOGGERS.DEBUG;
    ...
});
```

A stateless helper may be created directly in the spec when it needs no setup, e.g. `const parser = new Parser();` or `const serializer = new MapSerializer();`.

### Test body: Arrange, Act, Assert

Each `it` has up to three blocks, separated by blank lines:

1. **Arrange**: build the local input (request, headers, arguments). Skip it when the fixture already provides everything.
2. **Act**: one call to the member under test, stored in a variable named after its meaning (`response`, `result`, `location`, `configuration`, `hasProcedure`).
3. **Assert**: the `expect` calls.

Do not write `// Arrange`, `// Act` or `// Assert` comments. The blank lines show the structure.

When several similar inputs share one assertion style, it is fine to act on all of them first and then assert, as in the serializer specs:

```ts
it('should tell it cannot serialize others', () =>
{
    const supportsNonObject = serializer.canSerialize(MAPS.NON_OBJECT);
    const supportsNonMap = serializer.canSerialize(MAPS.NON_MAP);

    expect(supportsNonObject).toBeFalsy();
    expect(supportsNonMap).toBeFalsy();
});
```

### Async code and errors

- Mark the test `async` and `await` the call when the member returns a promise.
- **Async errors**: store the promise without awaiting it, then await the assertion:

  ```ts
  const promise = executionManager.run(request);

  await expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
  ```

- **Sync errors**: wrap the call in a function named `run` (or `result`) and assert `toThrow`:

  ```ts
  const run = () => versionParser.parse('1.2.3.4');

  expect(run).toThrow(new InvalidVersionNumber('1.2.3.4'));
  ```

- Always assert the **exact error instance**, including its constructor arguments (`new ProcedureNotFound('nonExisting')`), not only the error class. `toThrowError(ErrorClass)` is acceptable only when the error message is not deterministic.
- Only use `await` on an `expect` whose value is a promise (`.rejects` or `.resolves`). Never write `await expect(syncValue).toBe(...)`.

### Assertions

| Assertion | Use for |
| --- | --- |
| `toBe(value)` | Primitives and identity (`'public'`, `true`, `2`) |
| `toEqual(value)` | Plain objects, arrays, error instances |
| `toStrictEqual(value)` | Serialization and round-trip results, where `undefined` properties and class types matter |
| `toBeTruthy()` / `toBeFalsy()` | Results of `has*`, `can*` and `is*` methods |
| `toBeUndefined()` / `toBeDefined()` | Optional results |
| `toBeInstanceOf(Class)` | Checking which model type the result is (common in `analysis`) |
| `toHaveLength(n)` | Collections; prefer it over `expect(x.length).toBe(n)` |
| `toContain(value)` | Membership in arrays and strings |
| `toMatch(pattern)` | Formatted output such as log lines |
| `rejects.toEqual(error)` / `toThrow(error)` | Errors, see above |

For complex results, assert the type first and then the relevant properties one by one:

```ts
const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);

expect(funktion).toBeInstanceOf(ESFunction);
expect(funktion.identifier).toEqual('name');
expect(funktion.parameters).toHaveLength(2);
```

Use a type assertion (`as ESArrowFunction`) only after a `toBeInstanceOf` check has confirmed the type.

### Global state

- **Mutable shared fixtures** (e.g. the memory `writer` in `logging`): reset them in a top-level `beforeEach`:

  ```ts
  beforeEach(() =>
  {
      writer.clear();
  });
  ```

- **Environment variables**: use `vi.stubEnv(key, value)`, and call `vi.unstubAllEnvs()` in the same test (see `configuration/test/utils/ConfigurationReader.spec.ts`).
- **Runtime-dependent features**: skip the whole suite with `describe.skipIf(<FIXTURE>.SUPPORTED === false)(...)` and expose the `SUPPORTED` flag from the fixture (see `serialization/test/serializers/TemporalSerializer.spec.ts`).

### What not to test

- Thin wrappers around Node.js or third-party libraries (file system access, `path` calls). Leave a comment in the `describe` explaining why, as `sourcing/test/FileManager.spec.ts` does.
- Behavior that the fixture already sets up. Say so in a comment, e.g. `// Adding a valid segment is already done in the fixture`.
- Mark known gaps with a `// TODO: Add tests for ...` comment rather than writing an empty test.

## Fixture Files

### Shape

A fixture module builds its values in local `camelCase` constants, then exports them grouped in one `UPPER_SNAKE_CASE` object. Keys are `UPPER_SNAKE_CASE` too:

```ts

const emptyMap = new Map<unknown, unknown>();
const mixedMap = new Map<unknown, unknown>().set('a', 1).set('b', true);

const serializedEmptyMap = { serialized: true, name: 'Map', entries: { keys: [], values: [] } };
const serializedMixedMap = { serialized: true, name: 'Map', entries: { keys: ['a', 'b'], values: [1, true] } };

const nonMap = new Set();
const invalidName = { serialized: true, name: 'Set', entries: [], values: [] };

export const MAPS =
{
    EMPTY: emptyMap,
    EMPTY_SERIALIZED: serializedEmptyMap,
    MIXED: mixedMap,
    MIXED_SERIALIZED: serializedMixedMap,
    NON_MAP: nonMap,
    INVALID_NAME: invalidName
};
```

Conventions:

- Name the exported object after the subject, in plural: `SEGMENTS`, `PROCEDURES`, `LOCAL_WORKERS`, `EXECUTION_MANAGERS`, `FILENAMES`.
- Name the key after the scenario: `GENERAL`, `PUBLIC`, `PROTECTED`, `EMPTY`, `NESTED`, `INVALID_NAME`, `NON_EXISTING`.
- Pair inputs with expected outputs, either by suffix (`MIXED` / `MIXED_SERIALIZED`) or as nested groups (`INPUTS` / `OUTPUTS`, or `INPUT` / `OUTPUT` objects, as in `sourcing` and `logging`).
- Keep simple constants in a `values.fixture.ts` (`VALUES.URL`, `VALUES.TRUST_KEY`).
- Code strings for parser tests are plain string values (`FUNCTIONS.DECLARATION = "function name() {}"`).
- Use an inline comment when the purpose of a value is not obvious, e.g. `// Misses the age`.

### Instance fixtures

Construct the system under test, with all its dependencies, in a fixture. Build on other fixtures by importing their modules directly:

```ts

import LocalWorker from '../../../src/worker/LocalWorker';

import { executionManager } from './executionManager.fixture';
import { healthManager } from './healthManager.fixture';
import { scheduleManager } from './scheduleManager.fixture';
import { VALUES } from './values.fixture';

const url = VALUES.URL;
const trustKey = VALUES.TRUST_KEY;

const publicWorker = new LocalWorker({ url, executionManager, healthManager, scheduleManager });
const protectedWorker = new LocalWorker({ url, trustKey, executionManager, healthManager, scheduleManager });

export const LOCAL_WORKERS =
{
    PUBLIC: publicWorker,
    PROTECTED: protectedWorker
};
```

- Inside the `fixtures/` folder, import sibling fixture modules directly (`'./values.fixture'`), not through `index.ts`, so you don't create circular imports.
- Fixtures of another test folder may be reused (`import { SEGMENTS } from '../models/fixtures';`).
- A single shared dependency or test double may be exported as a `camelCase` named constant instead of a group: `export const executionManager = ...`, `export const writer = new MemoryWriter();`, `export const classResolver = new MockClassResolver();`.

### Test doubles

Jitar tests do not use `vi.fn()` or `vi.mock()`. Replace a dependency with a small handwritten class that implements the same interface (or extends the real class), and put it in a fixture:

```ts

import HttpClient from '../../src/interfaces/HttpClient';

import { HTTP_RESPONSES, NOT_FOUND } from './httpResponses.fixture';

export class TestHttpClient implements HttpClient
{
    async execute(url: string, options: object): Promise<Response>
    {
        return HTTP_RESPONSES[url] ?? NOT_FOUND;
    }
}
```

- Prefix the class name to show its role: `Test*` (configurable fake, e.g. `TestFileSystem`, `TestHttpClient`), `Memory*` (records calls, e.g. `MemoryWriter` with `messages`, `lastMessage` and `clear()`), `Mock*` (returns canned answers, e.g. `MockClassResolver`), or `Dummy*` (does nothing meaningful, e.g. `DummyRemote`).
- Return data from other fixtures rather than hard-coding values in the class.
- Methods the test never reaches may throw `new NotImplemented()` from `@jitar/errors`.
- Larger doubles get their own `Test<Name>.ts` file. Either default-export it and import it directly where it is used (`TestFileSystem`), or use a named export re-exported from the index (`TestHttpClient`).

### Formatting

ESLint ignores `**/test/**/fixtures/**/*`, but write fixtures in the same style as source files anyway: a leading blank line, Allman braces, semicolons, single quotes for normal strings, and a trailing newline. Spec files are linted. Never add `eslint-disable` comments to them without explicit approval.

## Workflow

1. Read the source component and the package's `AGENTS.md`. List the public members and their success, edge and error cases, including every error class the component can throw.
2. Find the mirrored location in `test/` and check whether a spec and fixtures already exist. Extend them rather than creating parallel files.
3. Add or extend fixture modules for the instances, inputs, expected outputs and test doubles. Register new modules in `fixtures/index.ts`.
4. Write the spec using the template and naming rules above. Cover every public member with at least one positive case and the relevant negative or error cases.
5. Run `npm run test` in the package and make sure everything passes. Never weaken an assertion or delete a test just to make it pass. If the source is wrong, report it.
6. Run `npm run lint` from the repository root and fix any issues by hand (`--fix` is not supported).

## Checklist

- [ ] Spec is at `test/<mirrored path>/<ComponentName>.spec.ts`, with fixtures in a sibling `fixtures/` folder
- [ ] File starts with one blank line and ends with a newline. Braces use Allman style, statements end with semicolons
- [ ] Imports are grouped: `vitest`, then `@jitar/*`, then `../src/...`, then `./fixtures`
- [ ] Top-level `describe` uses the (folder-prefixed) component name, nested ones use `.member(params)`, and each `it` starts with `should`
- [ ] Shared instances come from fixtures and are aliased at the top of the spec
- [ ] Each test separates Arrange, Act and Assert with blank lines, and has no AAA comments
- [ ] Errors are asserted as exact instances: `rejects.toEqual(new X(...))` or `toThrow(new X(...))`
- [ ] Fixtures are exported as `UPPER_SNAKE_CASE` groups (or `camelCase` single instances) and re-exported from `fixtures/index.ts`
- [ ] Test doubles are handwritten classes in fixtures, with no `vi.fn` or `vi.mock`
- [ ] Mutable fixtures are reset in `beforeEach`, and stubbed environment variables are unstubbed
- [ ] `npm run test` (package) and `npm run lint` (root) pass
