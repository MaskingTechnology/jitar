
import type { ValidationScheme } from '@jitar/validation';

type RuntimeConfiguration =
{
    source: string;
    target: string;
    segments: string;
    resources: string;
};

export default RuntimeConfiguration;

const DefaultValues =
{
    FILENAME: './jitar.json',
    SOURCE: './src',
    TARGET: './dist',
    SEGMENTS: './segments',
    RESOURCES: './resources'
} as const;

const validationScheme: ValidationScheme =
{
    source: { type: 'string', required: false },
    target: { type: 'string', required: false },
    segments: { type: 'string', required: false },
    resources: { type: 'string', required: false }
} as const;

export { DefaultValues, validationScheme };
