
import type { ValidationScheme } from '@jitar/validation';

type RemoteWorkerConfiguration =
{
    unavailableThreshold?: number;
    stoppedThreshold?: number;
};

export default RemoteWorkerConfiguration;

const validationScheme: ValidationScheme =
{
    unavailableThreshold: { type: 'integer', required: false },
    stoppedThreshold: { type: 'integer', required: false }
} as const;

export { validationScheme };
