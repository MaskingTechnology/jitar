
import { IsOptional, IsNumber } from 'class-validator';

export default class GatewayConfiguration
{
    @IsNumber()
    @IsOptional()
    monitor?: number;
}
