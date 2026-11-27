# @jitar/serialization

This file extends the root [`AGENTS.md`](../../AGENTS.md) with package-specific information.

## Purpose

This package provides extensible serialization for end-to-end data transportation within the Jitar runtime. It supports serialization and deserialization of primitives, arrays, maps, sets, objects, classes, typed arrays, and buffers.

## Exports

| Exported Symbol     | Type           | Description                                                                 |
|---------------------|----------------|-----------------------------------------------------------------------------|
| `ClassNotFound`     | class (error)  | Thrown when a class key is not found in the resolver                        |
| `InvalidClass`      | class (error)  | Thrown when a resolved class is not a valid `Function`                      |
| `ClassResolver`     | interface      | Resolves classes to/from string keys (`resolveKey`, `resolveClass`)         |
| `Resolvable`        | type           | `{ key: string }` — base type for resolvable objects                        |
| `Serialized`        | type           | `{ serialized: boolean, name: string }` — base type for serialized objects  |
| `Serializer`        | class          | Root serializer dispatcher                                                  |
| `SerializerBuilder` | class          | Factory for building a complete `Serializer` with all built-in serializers |
| `ValueSerializer`   | abstract class | Base class for all serializers                                              |

Built-in serializers, the other error classes, and the serialized types are internal and not exported.

## Dependencies

| Package | Usage |
| --- | --- |
| `@jitar/analysis` | `Reflector`, `ESClass`, `ESParameter`, `ESIdentifierBinding` for class reflection in `ClassSerializer`; `Reflector` in `TypedArraySerializer` |

## Package structure

```
src/
├── index.ts                          ← Public exports
├── Serializer.ts                     ← Root serializer dispatcher
├── SerializerBuilder.ts              ← Factory for building complete serializers
├── ValueSerializer.ts                ← Abstract base class for all serializers
├── errors/                           ← Package-level error classes
├── interfaces/                       ← Interface definitions (ClassResolver)
├── serializers/                      ← Built-in serializers
│   └── errors/                       ← Serializer-specific error classes
└── types/                            ← Type definitions (Resolvable, Serialized, TypedArray)
    └── serialized/                   ← Serialized type definitions
test/
├── Serializer.spec.ts                ← Serializer tests
├── SerializerBuilder.spec.ts         ← SerializerBuilder tests
├── fixtures/                         ← Test fixtures
└── serializers/                      ← Serializer-specific tests
    └── fixtures/                     ← Serializer-specific fixtures
```

## Architecture

### Overview

#### Class Hierarchy

```
ValueSerializer (abstract)
├── PrimitiveSerializer
├── ObjectSerializer
├── ClassSerializer (conditional)
├── ErrorSerializer
├── RegExpSerializer
├── BigIntSerializer
├── UrlSerializer
├── DateSerializer
├── SetSerializer
├── MapSerializer
├── ArraySerializer
├── TypedArraySerializer
└── BufferSerializer (conditional)
```

#### Key Components

- **`Serializer`**: Root class that manages a list of `ValueSerializer` instances. Dispatches `serialize()` and `deserialize()` calls to the first applicable serializer (matched via `canSerialize`/`canDeserialize`). Serializers are added in reverse priority order (most specific first). Throws `NoSerializerFound` / `NoDeserializerFound` when nothing matches.

- **`ValueSerializer`**: Abstract base class defining the serializer contract. Exposes `canSerialize`, `canDeserialize`, `serialize`, and `deserialize` as abstract methods. Provides `serializeOther` and `deserializeOther` for recursive serialization through the parent `Serializer` (set by `Serializer.addSerializer`).

- **`SerializerBuilder`**: Factory class that constructs a complete `Serializer` with all built-in serializers. Accepts an optional `ClassResolver` to enable class serialization.

- **`ClassResolver`**: Interface for resolving class names to/from string keys. Required by `ClassSerializer` for serializing class instances.

#### Serializer Matching Order

Serializers are matched in the order they are added (most recently added = highest priority). The `SerializerBuilder` adds serializers in this order (last added = matched first):

1. `PrimitiveSerializer` — primitives (bool, number, string, undefined, symbol)
2. `ObjectSerializer` — plain objects (`value.constructor === Object`)
3. `ClassSerializer` — class instances (requires `ClassResolver`; only added when one is provided)
4. `ErrorSerializer` — built-in Error objects
5. `RegExpSerializer` — RegExp objects
6. `BigIntSerializer` — BigInt values
7. `UrlSerializer` — URL objects
8. `DateSerializer` — Date objects
9. `SetSerializer` — Set objects
10. `MapSerializer` — Map objects
11. `ArraySerializer` — Array objects
12. `TypedArraySerializer` — TypedArray (Int8Array, Uint8Array, etc.)
13. `BufferSerializer` — Buffer (conditionally, when `Buffer` is defined)

### Decisions

- **Prepend on add**: `Serializer.addSerializer` uses `unshift`, so the most recently added (most specific) serializer is matched first.
- **Recursive delegation through the parent**: Nested values are (de)serialized via `serializeOther`/`deserializeOther`, which go back through the parent `Serializer`; calling them without a parent throws `ParentSerializerNotSet`.
- **Async all the way**: All `serialize` and `deserialize` methods are `async` and return `Promise<unknown>`.
- **Conditional serializers**: `BufferSerializer` is only registered when `typeof Buffer !== 'undefined'` (Node.js environments). `ClassSerializer` is only registered when a `ClassResolver` is provided.
- **Common serialized shape**: Every serialized representation extends the `Serialized` type (`serialized` flag + `name`) so deserializers can recognize their own output.

## Coding Conventions

- **Allman brace style**: All opening curly braces go on the next line, except when `allowSingleLine: true` applies.
- **Private fields**: Use JavaScript private `#` prefix for private properties and methods.
- **Async all the way**: All `serialize` and `deserialize` methods are `async` and return `Promise<unknown>`.
- **No global pollution**: Do not export types or values to the global namespace unless shared across components.
- **Import order**: External dependencies first, core dependencies second, runtime dependencies third, types last.
- **Single quotes**: Use single quotes for all strings.
- **Comments**: Use `//` comments sparingly; explain the *why*, not the *what*.

## Writing New Serializers

### Requirements

Every new serializer must:

1. **Extend `ValueSerializer`** — never implement the interface manually.
2. **Implement all four abstract methods**:
   - `canSerialize(value: unknown): boolean` — returns `true` if this serializer handles the value.
   - `canDeserialize(value: unknown): boolean` — returns `true` if this serializer can deserialize the value.
   - `serialize(value: unknown): Promise<unknown>` — serializes the value.
   - `deserialize(value: unknown): Promise<unknown>` — deserializes the value.
3. **Use `this.serializeOther(value)`** and **`this.deserializeOther(value)`** for recursive serialization of nested values. These methods delegate to the parent `Serializer`, which dispatches to the next applicable serializer.
4. **Throw specific error types** for invalid input during deserialization (see existing serializer-specific errors in `src/serializers/errors/`).

### Serialization Pattern

All serializers follow a consistent pattern:

```typescript
export default class MySerializer extends ValueSerializer
{
    canSerialize(value: unknown): boolean
    {
        return value instanceof MyType;
    }

    canDeserialize(value: unknown): boolean
    {
        const typed = value as SerializedMyType;

        return typed instanceof Object
            && typed.serialized === true
            && typed.name === 'MyType'
            && typeof typed.value === 'string';
    }

    async serialize(value: MyType): Promise<SerializedMyType>
    {
        return { serialized: true, name: 'MyType', value: /* ... */ };
    }

    async deserialize(object: SerializedMyType): Promise<MyType>
    {
        // Validate and reconstruct the original value
    }
}
```

### Serialized Type Convention

All serialized representations follow a common shape defined by the `Serialized` type:

```typescript
type Serialized =
{
    serialized: boolean,
    name: string
};
```

Each serializer-specific type extends `Serialized` with additional properties:

```typescript
type SerializedMyType = Serialized &
{
    value: string
};
```

Define the serialized type in `src/types/serialized/SerializedMyType.ts`.

### Registering a New Serializer

1. Create the serializer class in `src/serializers/MySerializer.ts`.
2. If the serializer needs custom errors, create them in `src/serializers/errors/`.
3. Define the serialized type in `src/types/serialized/SerializedMyType.ts`.
4. Register the serializer in `SerializerBuilder.build()` — add it **after** less specific serializers (like `ObjectSerializer`) but **before** more generic ones (like `ArraySerializer`).
5. Export the serializer from `src/index.ts` (note: the built-in serializers are currently not exported; only export when it needs to be public).

## Error Classes

### Package-Level Errors (`src/errors/`)

| Error | Trigger |
|---|---|
| `ClassNotFound` | Class key not found in resolver |
| `InvalidClass` | Resolved class is not a valid `Function` |
| `NoSerializerFound` | No serializer matches the value type during serialization |
| `NoDeserializerFound` | No deserializer matches the value type during deserialization |
| `ParentSerializerNotSet` | `serializeOther`/`deserializeOther` called without parent set |

### Serializer-Specific Errors (`src/serializers/errors/`)

| Error | Trigger |
|---|---|
| `InvalidBigIntString` | Invalid string during BigInt deserialization |
| `InvalidBufferString` | Invalid base64 string during Buffer deserialization |
| `InvalidDateString` | Invalid ISO date string during Date deserialization |
| `InvalidRegExp` | Invalid source/flags during RegExp deserialization |
| `InvalidUrlString` | Invalid URL string during URL deserialization |

## Type Definitions

### Core Types (`src/types/`)

| Type | Description |
|---|---|
| `Resolvable` | `{ key: string }` — base type for resolvable objects |
| `Serialized` | `{ serialized: boolean, name: string }` — base type for all serialized objects |
| `TypedArray` | Union type of all TypedArray types |

### Serialized Types (`src/types/serialized/`)

Each serialized type extends `Serialized` and adds type-specific properties:

| Type | Properties |
|---|---|
| `SerializedClass` | `key`, `args`, `fields` |
| `SerializedDate` | `value` (ISO string) |
| `SerializedBuffer` | `base64` |
| `SerializedMap` | `entries: { keys, values }` |
| `SerializedSet` | `values` |
| `SerializedTypedArray` | `type`, `bytes` |
| `SerializedError` | `type`, `stack?`, `message`, `cause?` |
| `SerializedRegExp` | `source`, `flags` |
| `SerializedUrl` | `value` (string) |
| `SerializedBigInt` | `value` (string) |

The folder also contains `SerializableObject` and `SerializedObject` (both `Record<string, unknown>`), used by `ObjectSerializer` and `ClassSerializer`.

## Testing

### Running Tests

```bash
npm run test          # Run all tests
npm run test-coverage # Run tests with coverage
```

### Test Structure

- Serializer tests live in `test/serializers/<Name>Serializer.spec.ts`.
- Test fixtures live in `test/serializers/fixtures/<name>Fixtures.ts`.
- Use `vitest` with `describe`/`it`/`expect`.
- Each serializer test should cover:
  - Successful serialization round-trip
  - Successful deserialization round-trip
  - `canSerialize` returning `true` for matching types
  - `canDeserialize` returning `true` for matching serialized types
  - Error handling for invalid input during deserialization

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the package (`tsc -p tsconfig.json`) |
| `npm run lint` | Lint the package (must pass before merging) |
| `npm run test` | Run all tests (`vitest run`) |
| `npm run test-coverage` | Run tests with coverage report |
| `npm run clean` | Remove `dist/` directory |

## MCP Usage

Read the root [`AGENTS.md`](../../AGENTS.md) for more information.
