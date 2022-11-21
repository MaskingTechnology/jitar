
import { IsOptional, IsNumber } from 'npm:class-validator@^0.13.2';

export default class GatewayConfiguration
{
    @IsNumber()
    @IsOptional()
    monitor?: number;
}
