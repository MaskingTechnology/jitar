
import { IsArray, IsUrl, IsOptional } from 'class-validator';

export default class NodeConfiguration
{
    @IsUrl()
    @IsOptional()
    gateway?: string;

    @IsUrl()
    repository = '';

    @IsArray()
    segments?: string[];
}
