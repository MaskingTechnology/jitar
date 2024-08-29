
import { ValidationScheme } from '../../utils';

type RepositoryConfiguration =
{
    index: string;
    serveIndexOnNotFound: boolean;
    assets: string[];
};

export default RepositoryConfiguration;

const validationScheme: ValidationScheme =
{
    index: { type: 'string', required: false },
    serveIndexOnNotFound: { type: 'boolean', required: false },
    assets: { type: 'list', required: false, items: { type: 'string' } }
} as const;

export { validationScheme };