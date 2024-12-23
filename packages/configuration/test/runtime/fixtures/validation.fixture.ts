
import { ValidationResult } from "@jitar/validation";

const VALIDATION_RESULT: ValidationResult = 
{
    valid: false,
    errors: [
        "Unknown field 'invalid'",
    ]
} as const;

export { VALIDATION_RESULT };
