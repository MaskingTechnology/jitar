
import { RuntimeConfiguration } from '../../../src/runtime';

const defaultInput: Record<string, string> =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources'
} as const;

const defaultResult: RuntimeConfiguration =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources',
    meta:
    {
        configFile: './jitar.json',
        root: '.'
    }
} as const;

const runtimeInput: Record<string, string> =
{
    source: './source',
    target: './target',
    segments: './segment',
    resources: './resource'
} as const;

const runtimeResult: RuntimeConfiguration =
{
    source: './source',
    target: './target',
    segments: './segment',
    resources: './resource',
    meta:
    {
        configFile: 'valid-runtime-configuration.json',
        root: '.'
    }
} as const;

const missingResult: RuntimeConfiguration =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources',
    meta:
    {
        configFile: 'missing-runtime-configuration.json',
        root: '.'
    }
} as const;

const invalidInput: Record<string, string> =
{
    invalid: 'true'
} as const;

export const CONFIGURATIONS =
{
    INPUT:
    {
        DEFAULT: defaultInput,
        RUNTIME: runtimeInput,
        INVALID: invalidInput
    },
    RESULT:
    {
        DEFAULT: defaultResult,
        RUNTIME: runtimeResult,
        MISSING: missingResult
    }
} as const;
