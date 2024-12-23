
import { ValidationResult } from "@jitar/validation";

const VALIDATION_RESULT: ValidationResult = 
{
    valid: false,
    errors: [
        "Field 'url' is required",
    ]
} as const;

export { VALIDATION_RESULT };
