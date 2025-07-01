
export default class UnknownTemplate extends Error
{
    constructor(templateName: string)
    {
        super(`Unknown template: ${templateName}`);
    }
}
