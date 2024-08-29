
import { ValidationResult } from '../../utils';

export default class ServerConfigurationInvalid extends Error
{
    public constructor(validation: ValidationResult)
    {
        super(validation.errors.join('\n'));
    }
}
