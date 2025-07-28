
import type { ValidationScheme } from '@jitar/validation';

type WorkerConfiguration =
{
    gateway?: string;
    segments: string[];
    trustKey?: string;
    reportInterval?: number;
};

export default WorkerConfiguration;

const validationScheme: ValidationScheme =
{
    gateway: { type: 'url', required: false },
    segments: { type: 'list', required: true, items: { type: 'string' } },
    trustKey: { type: 'string', required: false },
    reportInterval: { type: 'integer', required: false }
} as const;

export { validationScheme };
