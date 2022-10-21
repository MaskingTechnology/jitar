
import { ArrayNotEmpty, IsUrl } from 'class-validator';

export default class NodeDto
{
    @IsUrl()
    url = '';

    @ArrayNotEmpty()
    procedureNames: string[] = [];
}
