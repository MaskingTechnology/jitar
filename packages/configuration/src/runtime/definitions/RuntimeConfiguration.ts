
import type { ValidationScheme } from '@jitar/validation';

type RuntimeConfiguration =
{
    source: string;
    target: string;
    segments: string;
    resources: string;
    
    build:
    {
        ignore: string[];
    }

    meta:
    {
        root: string;
        configFile: string;
    }
};

export default RuntimeConfiguration;

const DefaultValues =
{
    FILENAME: './jitar.json',
    SOURCE: './src',
    TARGET: './dist',
    SEGMENTS: './segments',
    RESOURCES: './resources',
    BUILD: { ignore: [] },
    BUILD_IGNORE: []
};

const validationScheme: ValidationScheme =
{
    source: { type: 'string', required: false },
    target: { type: 'string', required: false },
    segments: { type: 'string', required: false },
    resources: { type: 'string', required: false },

    build: {
        type: 'group',
        fields: {
            ignore: { type: 'list', items: { type: 'string' }, required: false },
        },
        required: false
    }
} as const;

export { DefaultValues, validationScheme };
