
import type { ValidationScheme } from '@jitar/validation';

type RepositoryConfiguration =
{
    indexFilename?: string;
    serveIndexOnNotFound?: boolean;
    assetRoot?: string;
    assets?: string[];
};

export default RepositoryConfiguration;

const validationScheme: ValidationScheme =
{
    indexFilename: { type: 'string', required: false },
    serveIndexOnNotFound: { type: 'boolean', required: false },
    assetRoot: { type: 'string', required: false },
    assets: { type: 'list', required: false, items: { type: 'string' } }
} as const;

export { validationScheme };
