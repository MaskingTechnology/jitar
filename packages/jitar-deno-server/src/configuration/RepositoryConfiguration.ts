
import { IsArray, IsOptional, IsString } from 'npm:class-validator@^0.13.2';

export default class RepositoryConfiguration
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
    assets?: string[];
}
