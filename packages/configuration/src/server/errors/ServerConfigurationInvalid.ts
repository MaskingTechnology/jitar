
import type { ValidationResult } from '../../utils';

export default class ServerConfigurationInvalid extends Error
{
    public constructor(validation: ValidationResult)
    {
        const errorMessages = validation.errors.join('\n');

        super(`Server configuration is invalid:\n${errorMessages}`);
    }
}
