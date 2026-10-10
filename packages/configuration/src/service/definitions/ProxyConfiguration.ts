
import type { ValidationScheme } from '@jitar/validation';

type ProxyConfiguration =
{
    gateway: string;
    repository: string;
};

export default ProxyConfiguration;

const validationScheme: ValidationScheme =
{
    gateway: { type: 'url', required: true },
    repository: { type: 'url', required: true }
} as const;

export { validationScheme };
