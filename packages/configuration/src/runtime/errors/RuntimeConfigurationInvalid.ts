
import type { ValidationResult } from '@jitar/validation';

export default class RuntimeConfigurationInvalid extends Error
{
    public constructor(filename: string, validation: ValidationResult)
    {
        const errorMessages = validation.errors.join('\n');

        super(`Invalid runtime configuration '${filename}'\n${errorMessages}`);
    }
}
