
import type { ValidationScheme } from '@jitar/validation';

import GatewayConfiguration, { validationScheme as gatewayValidationScheme } from './GatewayConfiguration';
import ProxyConfiguration, { validationScheme as proxyValidationScheme } from './ProxyConfiguration';
import RepositoryConfiguration, { validationScheme as repositoryValidationScheme } from './RepositoryConfiguration';
import StandaloneConfiguration, { validationScheme as standaloneValidationScheme } from './StandaloneConfiguration';
import WorkerConfiguration, { validationScheme as workerValidationScheme } from './WorkerConfiguration';
import RemoteWorkerConfiguration, { validationScheme as remoteWorkerValidationScheme } from './RemoteWorkerConfiguration';

type ServerConfiguration =
{
    url: string;
    setUp?: string[];
    tearDown?: string[];
    middleware?: string[];
    healthChecks?: string[];

    gateway?: GatewayConfiguration;
    proxy?: ProxyConfiguration;
    repository?: RepositoryConfiguration;
    standalone?: StandaloneConfiguration;
    worker?: WorkerConfiguration;
    remoteWorker?: RemoteWorkerConfiguration;
};

export default ServerConfiguration;

const validationScheme: ValidationScheme =
{
    url: { type: 'url', required: true },
    setUp: { type: 'list', required: false, items: { type: 'string' } },
    tearDown: { type: 'list', required: false, items: { type: 'string' } },
    middleware: { type: 'list', required: false, items: { type: 'string' } },
    healthChecks: { type: 'list', required: false, items: { type: 'string' } },

    gateway: { type: 'group', required: false, fields: gatewayValidationScheme },
    proxy: { type: 'group', required: false, fields: proxyValidationScheme },
    repository: { type: 'group', required: false, fields: repositoryValidationScheme },
    standalone: { type: 'group', required: false, fields: standaloneValidationScheme },
    worker: { type: 'group', required: false, fields: workerValidationScheme },
    remoteWorker: { type: 'group', required: false, fields: remoteWorkerValidationScheme }
} as const;

export { validationScheme };
