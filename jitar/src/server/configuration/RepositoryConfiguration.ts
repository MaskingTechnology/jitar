
import { IsOptional, IsString } from 'class-validator';

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
}
