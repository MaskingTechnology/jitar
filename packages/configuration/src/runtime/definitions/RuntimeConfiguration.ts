
import type { ValidationScheme } from '../../utils';

type RuntimeConfiguration =
{
    source: string;
    target: string;
};

export default RuntimeConfiguration;

const DefaultValues =
{
    FILENAME: './jitar.json',
    SOURCE: './src',
    TARGET: './dist'
} as const;

const validationScheme: ValidationScheme =
{
    source: { type: 'string', required: false },
    target: { type: 'string', required: false }
} as const;

export { DefaultValues, validationScheme };
