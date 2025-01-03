
import { RuntimeConfiguration } from '../../../src/runtime';

const defaultConfiguration: RuntimeConfiguration =
{
    source: './src',
    target: './dist',
    segments: './segments',
    resources: './resources',
} as const;

const runtimeConfiguration: RuntimeConfiguration =
{
    source: './source',
    target: './target',
    segments: './segment',
    resources: './resource',
} as const;

const invalidConfiguration: any =
{
    invalid: true
} as const;

export const CONFIGURATIONS: Record<string, RuntimeConfiguration> =
{
    DEFAULT: defaultConfiguration,
    RUNTIME: runtimeConfiguration,
    INVALID: invalidConfiguration,
} as const;
