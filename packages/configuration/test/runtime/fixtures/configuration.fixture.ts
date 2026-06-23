
import { RuntimeConfiguration } from '../../../src/runtime';

const defaultInput: Record<string, unknown> =
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
    build:
    {
        ignore: []
    },
    meta:
    {
        configFile: './jitar.json',
        root: '.'
    }
} as const;

const runtimeInput: Record<string, unknown> =
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
    build:
    {
        ignore: []
    },
    meta:
    {
        configFile: 'valid-runtime-configuration.json',
        root: '.'
    }
} as const;

const buildInput: Record<string, unknown> =
{
    build:
    {
        ignore: ['app/**/*']
    }
} as const;

const buildResult: RuntimeConfiguration =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources',
    build:
    {
        ignore: ['app/**/*']
    },
    meta:
    {
        configFile: 'build-runtime-configuration.json',
        root: '.'
    }
} as const;

const missingResult: RuntimeConfiguration =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources',
    build:
    {
        ignore: []
    },
    meta:
    {
        configFile: 'missing-runtime-configuration.json',
        root: '.'
    }
} as const;

const invalidInput: Record<string, unknown> =
{
    invalid: true
} as const;

export const CONFIGURATIONS =
{
    INPUT:
    {
        DEFAULT: defaultInput,
        RUNTIME: runtimeInput,
        BUILD: buildInput,
        INVALID: invalidInput
    },
    RESULT:
    {
        DEFAULT: defaultResult,
        RUNTIME: runtimeResult,
        BUILD: buildResult,
        MISSING: missingResult
    }
} as const;
