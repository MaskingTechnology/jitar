
import { IsOptional, IsNumber, IsUrl } from 'class-validator';

export default class GatewayConfiguration
{
    @IsNumber()
    @IsOptional()
    monitor?: number;

    @IsUrl()
    repository = '';
}
