
import { z } from 'zod';

import GatewayConfiguration, { gatewaySchema } from './GatewayConfiguration.js';
import NodeConfiguration, { nodeSchema } from './NodeConfiguration.js';
import ProxyConfiguration, { proxySchema } from './ProxyConfiguration.js';
import RepositoryConfiguration, { repositorySchema } from './RepositoryConfiguration.js';
import StandaloneConfiguration, { standaloneSchema } from './StandaloneConfiguration.js';

export const runtimeSchema = z
    .object({
        url: z.string().optional(),
        standalone: standaloneSchema.optional(),
        repository: repositorySchema.optional(),
        gateway: gatewaySchema.optional(),
        node: nodeSchema.optional(),
        proxy: proxySchema.optional(),
    })
    .strict()
    .transform((value) => new RuntimeConfiguration(value.url, value.standalone, value.repository, value.gateway, value.node, value.proxy));

export default class RuntimeConfiguration
{
    url?: string;
    standalone?: StandaloneConfiguration;
    repository?: RepositoryConfiguration;
    gateway?: GatewayConfiguration;
    node?: NodeConfiguration;
    proxy?: ProxyConfiguration;

    constructor(url?: string, standalone?: StandaloneConfiguration, repository?: RepositoryConfiguration, gateway?: GatewayConfiguration, node?: NodeConfiguration, proxy?: ProxyConfiguration)
    {
        this.url = url;
        this.standalone = standalone;
        this.repository = repository;
        this.gateway = gateway;
        this.node = node;
        this.proxy = proxy;
    }
}
