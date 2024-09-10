
import ValidationScheme, { FieldValidation, PrimitiveValidation, GroupValidation, ListValidation } from './types/ValidationScheme';
import ValidationResult from './types/ValidationResult';

export default class Validator
{
    validate(data: Record<string, unknown>, scheme: ValidationScheme): ValidationResult
    {
        const errors: string[] = [];
        
        this.#validateData('', data, scheme, errors);

        const valid = errors.length === 0;

        return { valid, errors };
    }

    #validateData(key: string, data: Record<string, unknown>, scheme: ValidationScheme, errors: string[]): void
    {
        const fieldKeys = Object.keys(scheme);

        for (const fieldKey of fieldKeys)
        {
            const fieldKeyFull = `${key}${fieldKey}`;
            const fieldScheme = scheme[fieldKey];
            const value = data[fieldKey];

            this.#validateField(fieldKeyFull, value, fieldScheme, errors);
        }
    }

    #validateField(key: string, value: unknown, scheme: FieldValidation, errors: string[]): void
    {
        if (value === undefined)
        {
            if (scheme.required === true)
            {
                errors.push(`Field '${key}' is required`);
            }

            return;
        }

        switch (scheme.type)
        {
            case 'string':
                return this.#validateString(key, value, scheme, errors);
            case 'integer':
                return this.#validateInteger(key, value, scheme, errors);
            case 'real':
                return this.#validateReal(key, value, scheme, errors);
            case 'boolean':
                return this.#validateBoolean(key, value, scheme, errors);
            case 'url':
                return this.#validateUrl(key, value, scheme, errors);
            case 'group':
                return this.#validateGroup(key, value, scheme, errors);
            case 'list':
                return this.#validateList(key, value, scheme, errors);
        }
    }

    #validateString(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
    {
        if (typeof value !== 'string')
        {
            errors.push(`Field '${key}' is not a string`);
        }
    }

    #validateInteger(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
    {
        if (typeof value !== 'number' || Number.isInteger(value) === false)
        {
            errors.push(`Field '${key}' is not an integer`);
        }
    }

    #validateReal(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
    {
        if (typeof value !== 'number')
        {
            errors.push(`Field '${key}' is not a real number`);
        }
    }

    #validateBoolean(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
    {
        if (typeof value !== 'boolean')
        {
            errors.push(`Field '${key}' is not a boolean`);
        }
    }

    #validateUrl(key: string, value: unknown, scheme: PrimitiveValidation, errors: string[]): void
    {
        if (typeof value !== 'string' || value.startsWith('http') === false)
        {
            errors.push(`Field '${key}' is not a valid URL`);
        }
    }

    #validateGroup(key: string, value: unknown, scheme: GroupValidation, errors: string[]): void
    {
        if (typeof value !== 'object')
        {
            errors.push(`Field '${key}' is not an object`);

            return;
        }

        const dataKey = `${key}.`;

        this.#validateData(dataKey, value as Record<string, unknown>, scheme.fields, errors);
    }

    #validateList(key: string, value: unknown, scheme: ListValidation, errors: string[]): void
    {
        if (!Array.isArray(value))
        {
            errors.push(`Field '${key}' is not a list`);

            return;
        }

        const data = value as unknown[];

        for (const itemIndex in data)
        {
            const itemKey = `${key}.${itemIndex}.`;
            const itemValue = data[itemIndex];

            this.#validateField(itemKey, itemValue, scheme.items, errors)
        }
    }
}
