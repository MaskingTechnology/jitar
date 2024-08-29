
import { ValidationScheme } from '../../utils';

type ProxyConfiguration =
{
    gateway: string;
    repository: string;
    middleware: string[];
};

export default ProxyConfiguration;

const validationScheme: ValidationScheme =
{
    gateway: { type: 'url', required: true },
    repository: { type: 'url', required: true },
    middleware: { type: 'list', required: false, items: { type: 'string' } }
} as const;

export { validationScheme };
