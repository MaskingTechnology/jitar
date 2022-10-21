
import { Contains, IsOptional, IsString } from 'class-validator';

export default class ServerOptions
{
    @IsString()
    @IsOptional()
    loglevel = 'info';

    @IsString()
    @Contains('.json')
    @IsOptional()
    config = 'config.json';
}
