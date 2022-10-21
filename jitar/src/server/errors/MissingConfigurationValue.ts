
export default class MissingConfigurationValue extends Error
{
    constructor(propertyName: string)
    {
        super(`Missing configuration value for '${propertyName}'`);
    }
}
