
import type { ValidationScheme } from '@jitar/validation';

type StandaloneConfiguration =
{
    segments: string[];
    middleware: string[];
    healthChecks: string[];

    indexFilename: string;
    serveIndexOnNotFound: boolean;
    assets: string[];
};

export default StandaloneConfiguration;

const validationScheme: ValidationScheme =
{
    segments: { type: 'list', required: true, items: { type: 'string' } },
    middleware: { type: 'list', required: false, items: { type: 'string' } },
    healthChecks: { type: 'list', required: false, items: { type: 'string' } },

    indexFilename: { type: 'string', required: false },
    serveIndexOnNotFound: { type: 'boolean', required: false },
    assets: { type: 'list', required: false, items: { type: 'string' } }
} as const;

export { validationScheme };
