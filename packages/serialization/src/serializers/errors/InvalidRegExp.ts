
export default class InvalidRegExp extends Error
{
    constructor(source: unknown, flags: unknown)
    {
        super(`Invalid regular expression '${source}' with flags '${flags}'`);
    }
}
