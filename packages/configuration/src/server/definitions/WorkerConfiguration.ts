
import type { ValidationScheme } from '@jitar/validation';

type WorkerConfiguration =
{
    gateway?: string;
    segments: string[];
    trustKey?: string;
};

export default WorkerConfiguration;

const validationScheme: ValidationScheme =
{
    gateway: { type: 'url', required: false },
    segments: { type: 'list', required: true, items: { type: 'string' } },
    trustKey: { type: 'string', required: false }
} as const;

export { validationScheme };
