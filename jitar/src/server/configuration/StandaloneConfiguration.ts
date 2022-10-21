
import { IsArray, IsOptional, IsString } from 'class-validator';

export default class StandaloneConfiguration
{
    @IsString()
    @IsOptional()
    source?: string;

    @IsString()
    @IsOptional()
    cache?: string;

    @IsString()
    @IsOptional()
    index?: string;

    @IsArray()
    @IsOptional()
    segments?: string[];
}
