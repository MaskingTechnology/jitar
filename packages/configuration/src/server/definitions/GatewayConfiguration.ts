
import type { ValidationScheme } from '@jitar/validation';

type GatewayConfiguration =
{
    monitor: number;
    trustKey?: string;
};

export default GatewayConfiguration;

const validationScheme: ValidationScheme =
{
    monitor: { type: 'integer', required: false },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
