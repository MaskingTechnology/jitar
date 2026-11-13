---
name: code-review
description: Performs thorough, objective, and actionable code reviews within the @jitar/configuration package. Reviews TypeScript changes for correctness, architectural integrity, and adherence to conventions.
disabled: true
---

# Code Review Skill

## Overview

Reviews TypeScript changes for correctness, architectural integrity, and adherence to the conventions in the package [`AGENTS.md`](../../../AGENTS.md), and that of the root [`AGENTS.md`](../../../../../AGENTS.md).

## When to Use

Invoke this skill when asked to review a diff, pull request, or set of staged changes.

---

## Review Philosophy

- Review code objectively and independently.
- Focus on correctness rather than personal preferences.
- Prioritize actionable findings over stylistic observations.
- Evaluate changes in the context of the existing architecture.
- Do not assume that a different implementation is necessarily better.
- Do not report speculative problems without evidence.
- Do not invent requirements that were not established by the task or repository.
- Avoid reporting issues that existing tooling already catches unless they reveal a significant underlying problem.
- Do not modify source code or fix findings unless explicitly requested.
- The review should prioritize defects and risks, not praise or summaries of the implementation.

---

## Step 1: Understand the Change

Before reviewing:

1. Identify the scope of the changes.
2. Understand the intended behavior.
3. Read the relevant task description or requirements.
4. Inspect the complete diff.
5. Identify affected modules, packages, and consumers.
6. Read surrounding code to understand existing behavior.
7. Identify potential regressions and compatibility concerns.

Do not review changed lines in isolation when surrounding context matters.

### Scope Identification Checklist

- [ ] Which modules are affected (`runtime/`, `service/`, `utils/`, `environment/`)?
- [ ] Are any public exports in `src/index.ts` changed?
- [ ] Are any index files (`*/index.ts`) modified?
- [ ] Are any test files or fixtures modified?
- [ ] Are any error messages or formats changed?

---

## Step 2: Correctness and Logic

Check for:

- Incorrect business logic.
- Incorrect assumptions.
- Missing conditions.
- Incorrect boundary handling.
- Null and undefined handling.
- Incorrect state transitions.
- Race conditions.
- Asynchronous execution problems.
- Resource leaks.
- Incorrect error propagation.
- Unexpected side effects.
- Inconsistent behavior between code paths.

### Package-Specific Correctness Checks

- **ConfigurationReader**: Does it still return `{}` for missing files? Does it still throw `InvalidConfigurationFile` for non-JSON?
- **Builder defaults**: Are all default values applied via nullish coalescing assignment (`??=`)? Are defaults applied in the correct order?
- **Meta property**: Is `meta.root` and `meta.configFile` always set?
- **Validation**: Does the validation scheme match the type definition? Are all type fields represented in the scheme?
- **Env var interpolation**: Does the regex `/\${([^}]*)}/g` still work correctly? Are missing env vars handled (resolving to `'null'`)?

---

## Step 3: TypeScript and Type Safety

Check for:

- Incorrect or overly broad types.
- Unnecessary use of `any`.
- Unsafe type assertions.
- Incorrect generic constraints.
- Incorrect narrowing.
- Potential runtime errors hidden by type assumptions.
- Incorrect optional property handling.
- Type incompatibilities.
- Public API type regressions.
- Type definitions that do not accurately represent runtime behavior.

### Package-Specific Type Checks

- **Type definitions**: Are all optional properties marked with `?`? Are required properties not marked optional?
- **Validation schemes**: Do all type fields have corresponding scheme entries? Are scheme field types correct (`string`, `url`, `integer`, `boolean`, `list`, `group`)?
- **Type composition**: When using intersection types (e.g., `StandaloneConfiguration = RepositoryConfiguration & Pick<WorkerConfiguration, 'segments'>`), do the validation schemes spread correctly?
- **`as const`**: Are all validation scheme objects marked `as const`?
- **Type casts**: The builder casts reader output with `as RuntimeConfiguration` / `as ServiceConfiguration` — is this justified?

---

## Step 4: Architecture and Design

Check for:

- Violations of package responsibilities.
- Incorrect dependency direction.
- Circular dependencies.
- Unnecessary coupling.
- Abstraction leaks.
- Duplication of existing functionality.
- Inconsistent architectural patterns.
- Incorrect placement of responsibilities.
- Unnecessary abstractions.
- Violations of established package conventions.

### Package-Specific Architecture Checks

- **Layering**: Does the change respect the layering (ConfigurationManager → Builders → Readers → Validators)?
- **Builder responsibilities**: Do builders only apply defaults and add `meta`? Should they not perform file I/O?
- **Reader responsibilities**: Should readers only read and interpolate? Should they not validate?
- **Error boundaries**: Are errors thrown at the right layer (readers throw for file issues, builders throw for validation issues)?
- **Composition**: Does `ConfigurationManager` properly compose its sub-components?
- **Export boundaries**: Are only intended members exported through index files?

---

## Step 5: API and Compatibility

Where applicable, check for:

- Breaking changes to public exports.
- Changes to function signatures.
- Changes to runtime behavior.
- Changes to error contracts.
- Changes to serialization or data formats.
- Backward compatibility problems.
- Incorrect default values.
- Unexpected changes to optional behavior.
- Downstream package impact.

### Package-Specific API Checks

- **Public exports**: Any change to `src/index.ts` exports affects all monorepo consumers.
- **Method signatures**: Changing `ConfigurationManager` methods affects all callers.
- **Error contracts**: Changing error message formats breaks test assertions.
- **Default values**: Changing defaults changes runtime behavior for users relying on them.
- **Type definitions**: Adding/removing properties changes the shape of configuration objects.

---

## Step 6: Security and Reliability

Where relevant, inspect:

- Input validation.
- Trust boundaries.
- Injection vulnerabilities.
- Authentication and authorization.
- Sensitive information exposure.
- Unsafe deserialization.
- Path traversal.
- Improper error disclosure.
- Unsafe external data handling.
- Resource exhaustion.
- Insecure defaults.

### Package-Specific Security Checks

- **File paths**: Does `ConfigurationReader` properly handle path traversal via file names?
- **Environment variables**: Does env var interpolation expose sensitive data in error messages?
- **JSON parsing**: Does `JSON.parse` handle malformed or extremely large JSON?
- **Error messages**: Do error messages leak file system paths or internal state?
- **`.env` files**: Does `Configurator` handle missing or malformed `.env` files gracefully?

---

## Step 7: Performance

Look for meaningful performance problems, including:

- Unnecessary repeated computations.
- Inefficient algorithms.
- Excessive allocations.
- Unnecessary network or database requests.
- Memory leaks.
- Unbounded collections or caches.
- Blocking operations.
- Inefficient serialization or data transformations.

### Package-Specific Performance Checks

- **File reading**: Is the file read once per configuration build?
- **Regex compilation**: Is the env var regex compiled once as a const?
- **Object allocation**: Are default values reused rather than recreated per build?

---

## Step 8: Testing and Regression Coverage

Evaluate whether:

- New behavior is adequately tested.
- Existing tests cover modified behavior.
- Important edge cases are covered.
- Error scenarios are tested.
- Tests verify observable behavior rather than implementation details.
- The changes introduce behavior that existing tests do not protect against.

### Package-Specific Testing Checks

- **Test structure**: Do tests mirror source structure (`test/<module>/<ComponentName>.spec.ts`)?
- **Fixtures**: Are fixtures updated to reflect new configuration fields?
- **Error paths**: Are error scenarios tested with `await expect(promise).rejects.toEqual(new <ErrorClass>(...))`?
- **Success paths**: Are success scenarios tested with `await expect(promise).resolves.toEqual(...)`?
- **Environment variables**: Are env var tests using `vi.stubEnv()` / `vi.unstubAllEnvs()`?
- **Missing files**: Are missing file scenarios tested (returns defaults)?
- **Invalid files**: Are non-JSON file scenarios tested (throws `InvalidConfigurationFile`)?
- **Partial configurations**: Are partial config scenarios tested (defaults applied for missing fields)?

---

## Step 9: Verify Findings

Before reporting a finding:

1. Locate the exact relevant code.
2. Understand the execution path.
3. Verify that the problem is actually possible.
4. Determine its impact.
5. Check whether it is already handled elsewhere.
6. Confirm that it is introduced by the reviewed changes or directly affected by them.

Never report hypothetical issues as confirmed defects.

---

## Finding Severity

Use the following severity levels:

### Critical
A severe defect that can cause major security compromise, data loss, or widespread system failure.

### High
A significant defect that causes incorrect behavior, serious regressions, security vulnerabilities, or substantial compatibility problems.

### Medium
A meaningful defect that affects specific scenarios, edge cases, reliability, or maintainability in a way that warrants correction.

### Low
A minor issue with limited impact that is still actionable.

### Informational
An observation or improvement suggestion that is not a confirmed defect.

Do not inflate severity. Explain the actual impact rather than relying on labels.

---

## Finding Format

Every finding must include:

- Severity.
- A concise title.
- Exact file and line reference.
- Description of the problem.
- Why the problem occurs.
- Concrete impact or failure scenario.
- Suggested direction for fixing it.

```
[SEVERITY] Short description

File: `path/to/file.ts:123`

Problem:
Explain the specific defect.

Impact:
Explain when and how this affects the application or package.

Suggested fix:
Describe the necessary correction without unnecessarily prescribing an entire implementation.
```

Only include findings that are actionable and supported by evidence.

---

## Review Output Structure

### Findings

List findings ordered by severity, highest first.

### Areas Reviewed

Briefly identify the main areas examined.

### Testing and Verification

Report:
- Checks actually executed.
- Checks that could not be executed.
- Any relevant verification limitations.

### Overall Assessment

Choose one:

- **Changes requested:** At least one meaningful issue should be fixed before merging.
- **Approved:** No actionable issues were identified within the reviewed scope.
- **Inconclusive:** The review could not establish correctness because of missing context or verification limitations.

Do not claim approval merely because no issues were immediately obvious.

---

## Important Restrictions

- Do not modify source files.
- Do not automatically fix identified issues.
- Do not generate commits.
- Do not change configuration.
- Do not report style preferences as defects.
- Do not duplicate findings.
- Do not report issues unrelated to the changes unless they are directly relevant to the review.
- Do not claim to have executed tests or commands that were not executed.
- Clearly distinguish confirmed defects from informational suggestions.