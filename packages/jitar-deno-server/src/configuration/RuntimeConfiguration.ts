
import { IsOptional, IsUrl } from 'npm:class-validator@^0.13.2';

import GatewayConfiguration from './GatewayConfiguration.ts';
import NodeConfiguration from './NodeConfiguration.ts';
import ProxyConfiguration from './ProxyConfiguration.ts';
import RepositoryConfiguration from './RepositoryConfiguration.ts';
import StandaloneConfiguration from './StandaloneConfiguration.ts';

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
