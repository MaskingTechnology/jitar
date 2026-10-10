
import type { ValidationScheme } from '@jitar/validation';

type GatewayConfiguration =
{
    monitorInterval?: number;
    trustKey?: string;
};

export default GatewayConfiguration;

const validationScheme: ValidationScheme =
{
    monitorInterval: { type: 'integer', required: false },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
