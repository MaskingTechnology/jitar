
import type { ValidationScheme } from '@jitar/validation';

type RepositoryConfiguration =
{
    indexFilename?: string;
    fallback?: string;
    assetRoot?: string;
    assets?: string[];
};

export default RepositoryConfiguration;

const validationScheme: ValidationScheme =
{
    indexFilename: { type: 'string', required: false },
    fallback: { type: 'string', required: false },
    assetRoot: { type: 'string', required: false },
    assets: { type: 'list', required: false, items: { type: 'string' } }
} as const;

export { validationScheme };
