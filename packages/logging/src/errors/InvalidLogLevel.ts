
export default class InvalidLogLevel extends Error
{
    constructor(logLevel: string)
    {
        super(`Invalid log level: ${logLevel}`);
    }
}
