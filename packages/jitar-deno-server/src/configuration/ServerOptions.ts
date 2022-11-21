
import { Contains, IsOptional, IsString } from 'npm:class-validator@^0.13.2';

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
