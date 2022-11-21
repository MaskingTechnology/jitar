
import { IsArray, IsUrl, IsOptional } from 'npm:class-validator@^0.13.2';

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
