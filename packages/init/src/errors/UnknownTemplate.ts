
import { ServerError } from '@jitar/errors';

export default class UnknownTemplate extends ServerError
{
    constructor(templateName: string)
    {
        super(`Unknown template: ${templateName}`);
    }
}
