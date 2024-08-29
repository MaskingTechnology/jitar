
import { ValidationResult } from '../../utils';

export default class RuntimeConfigurationInvalid extends Error
{
    public constructor(validation: ValidationResult)
    {
        super(validation.errors.join('\n'));
    }
}
