
import type { ValidationScheme } from '@jitar/validation';

type HttpConfiguration =
{
    bodyLimit?: number;
    proxied?: boolean;
};

export default HttpConfiguration;

const validationScheme: ValidationScheme =
{
    bodyLimit: { type: 'integer', required: false },
    proxied: { type: 'boolean', required: false }
} as const;

export { validationScheme };
