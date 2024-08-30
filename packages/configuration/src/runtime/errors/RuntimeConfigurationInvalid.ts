
import type { ValidationResult } from '../../utils';

export default class RuntimeConfigurationInvalid extends Error
{
    public constructor(validation: ValidationResult)
    {
        const errorMessages = validation.errors.join('\n');

        super(`Runtime configuration is invalid:\n${errorMessages}`);
    }
}
