
import { IsUrl, IsOptional } from 'npm:class-validator@^0.13.2';

export default class ProxyConfiguration
{
    @IsUrl()
    @IsOptional()
    node?: string;

    @IsUrl()
    @IsOptional()
    gateway?: string;

    @IsUrl()
    repository?: string;
}
