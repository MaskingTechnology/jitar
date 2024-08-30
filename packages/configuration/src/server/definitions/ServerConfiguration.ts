
import type { ValidationScheme } from '../../utils';

import GatewayConfiguration, { validationScheme as gatewayValidationScheme } from './GatewayConfiguration';
import ProxyConfiguration, { validationScheme as proxyValidationScheme } from './ProxyConfiguration';
import RepositoryConfiguration, { validationScheme as repositoryValidationScheme } from './RepositoryConfiguration';
import StandaloneConfiguration, { validationScheme as standaloneValidationScheme } from './StandaloneConfiguration';
import WorkerConfiguration, { validationScheme as workerValidationScheme } from './WorkerConfiguration';

type ServerConfiguration =
{
    url: string;
    setup?: string[];
    teardown?: string[];

    gateway?: GatewayConfiguration;
    proxy?: ProxyConfiguration;
    repository?: RepositoryConfiguration;
    standalone?: StandaloneConfiguration;
    worker?: WorkerConfiguration;
};

export default ServerConfiguration;

const validationScheme: ValidationScheme =
{
    url: { type: 'url', required: true },
    setup: { type: 'list', required: false, items: { type: 'string' } },
    teardown: { type: 'list', required: false, items: { type: 'string' } },

    gateway: { type: 'group', required: false, fields: gatewayValidationScheme },
    proxy: { type: 'group', required: false, fields: proxyValidationScheme },
    repository: { type: 'group', required: false, fields: repositoryValidationScheme },
    standalone: { type: 'group', required: false, fields: standaloneValidationScheme },
    worker: { type: 'group', required: false, fields: workerValidationScheme }
} as const;

export { validationScheme };
