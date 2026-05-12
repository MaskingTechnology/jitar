
import type { ValidationScheme } from '@jitar/validation';

import type RepositoryConfiguration from './RepositoryConfiguration';
import { validationScheme as repositoryScheme } from './RepositoryConfiguration';
import type WorkerConfiguration from './WorkerConfiguration';
import { validationScheme as workerScheme } from './WorkerConfiguration';

type StandaloneConfiguration = RepositoryConfiguration
                             & Pick<WorkerConfiguration, 'segments'>;

export default StandaloneConfiguration;

const validationScheme: ValidationScheme =
{
    ...repositoryScheme,
    segments: workerScheme.segments
} as const;

export { validationScheme };
