
import { ValidationScheme } from '../../utils';

type WorkerConfiguration =
{
    gateway?: string;
    segments: string[];
    middleware: string[];
    healthChecks: string[];
    trustKey?: string;
};

export default WorkerConfiguration;

const validationScheme: ValidationScheme =
{
    gateway: { type: 'url', required: false },
    segments: { type: 'list', required: true, items: { type: 'string' } },
    middleware: { type: 'list', required: false, items: { type: 'string' } },
    healthChecks: { type: 'list', required: false, items: { type: 'string' } },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
