
import { IsUrl, IsOptional } from 'class-validator';

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
