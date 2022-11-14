
import { IsOptional, IsUrl } from 'class-validator';

import GatewayConfiguration from './GatewayConfiguration.js';
import NodeConfiguration from './NodeConfiguration.js';
import ProxyConfiguration from './ProxyConfiguration.js';
import RepositoryConfiguration from './RepositoryConfiguration.js';
import StandaloneConfiguration from './StandaloneConfiguration.js';

export default class RuntimeConfiguration
{
    @IsUrl()
    @IsOptional()
    url?: string;

    @IsOptional()
    standalone?: StandaloneConfiguration;

    @IsOptional()
    repository?: RepositoryConfiguration;

    @IsOptional()
    gateway?: GatewayConfiguration;

    @IsOptional()
    node?: NodeConfiguration;

    @IsOptional()
    proxy?: ProxyConfiguration;
}
