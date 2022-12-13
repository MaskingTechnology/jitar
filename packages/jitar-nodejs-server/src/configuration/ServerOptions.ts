
import { Contains, IsEnum, IsOptional, IsString } from 'class-validator';
import { LogLevel } from '../utils/LogBuilder.js';

export default class ServerOptions
{
    @IsString()
    @IsOptional()
    @IsEnum(LogLevel)
    loglevel = 'info';

    @IsString()
    @Contains('.json')
    @IsOptional()
    config = 'config.json';
}
