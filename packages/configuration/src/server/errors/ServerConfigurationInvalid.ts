
import type { ValidationResult } from '@jitar/validation';

const BREAK = '\n => ';

export default class ServerConfigurationInvalid extends Error
{
    public constructor(validation: ValidationResult)
    {
        const errorMessages = validation.errors.join(BREAK);

        super(`Invalid server configuration:${BREAK}${errorMessages}`);
    }
}
