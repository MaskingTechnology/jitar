
export default class InvalidConfigurationFile extends Error
{
    constructor(filename: string)
    {
        super(`${filename} is not a valid configuration file.`);
    }
}
