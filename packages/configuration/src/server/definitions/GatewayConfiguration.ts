
import { ValidationScheme } from '../../utils';

type GatewayConfiguration =
{
    monitor: number;
    middleware: string[];
    healthChecks: string[];
    trustKey?: string;
};

export default GatewayConfiguration;

const validationScheme: ValidationScheme =
{
    monitor: { type: 'integer', required: false },
    middleware: { type: 'list', required: false, items: { type: 'string' } },
    healthChecks: { type: 'list', required: false, items: { type: 'string' } },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
