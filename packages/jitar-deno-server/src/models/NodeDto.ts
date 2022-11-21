
import { ArrayNotEmpty, IsUrl } from 'npm:class-validator@^0.13.2';

export default class NodeDto
{
    @IsUrl()
    url = '';

    @ArrayNotEmpty()
    procedureNames: string[] = [];
}
