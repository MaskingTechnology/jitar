
import { describe, expect, it } from 'vitest';

import { Validator } from '../src';

import { VALIDATION_SCHEMES, VALUES } from './fixtures';

describe('Validator', () =>
{
    describe('String values', () =>
    {
        it('should accept a valid string', () =>
        {
            const validator = new Validator();
            const data = { string: 'string' };
            const scheme = VALIDATION_SCHEMES.STRING;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid string', () =>
        {
            const validator = new Validator();
            const data = { string: 123 };
            const scheme = VALIDATION_SCHEMES.STRING;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_STRING);
        });

        it('should reject a missing required string', () =>
        {
            const validator = new Validator();
            const data = { string: undefined };
            const scheme = VALIDATION_SCHEMES.STRING;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_STRING);
        });
    });

    describe('Integer values', () =>
    {
        it('should accept a valid integer', () =>
        {
            const validator = new Validator();
            const data = { integer: 123 };
            const scheme = VALIDATION_SCHEMES.INTEGER;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid integer', () =>
        {
            const validator = new Validator();
            const data = { integer: '123' };
            const scheme = VALIDATION_SCHEMES.INTEGER;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_INTEGER);
        });

        it('should reject a missing required integer', () =>
        {
            const validator = new Validator();
            const data = { integer: undefined };
            const scheme = VALIDATION_SCHEMES.INTEGER;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_INTEGER);
        });
    });

    describe('Real values', () =>
    {
        it('should accept a valid real', () =>
        {
            const validator = new Validator();
            const data = { real: 123.45 };
            const scheme = VALIDATION_SCHEMES.REAL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid real', () =>
        {
            const validator = new Validator();
            const data = { real: '123.45' };
            const scheme = VALIDATION_SCHEMES.REAL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_REAL);
        });

        it('should reject a missing required real', () =>
        {
            const validator = new Validator();
            const data = { real: undefined };
            const scheme = VALIDATION_SCHEMES.REAL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_REAL);
        });
    });

    describe('Boolean values', () =>
    {
        it('should accept a valid boolean', () =>
        {
            const validator = new Validator();
            const data = { boolean: true };
            const scheme = VALIDATION_SCHEMES.BOOLEAN;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid boolean', () =>
        {
            const validator = new Validator();
            const data = { boolean: 'true' };
            const scheme = VALIDATION_SCHEMES.BOOLEAN;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_BOOLEAN);
        });

        it('should reject a missing required boolean', () =>
        {
            const validator = new Validator();
            const data = { boolean: undefined };
            const scheme = VALIDATION_SCHEMES.BOOLEAN;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_BOOLEAN);
        });
    });

    describe('URL values', () =>
    {
        it('should accept a valid URL', () =>
        {
            const validator = new Validator();
            const data = { url: 'https://example.com' };
            const scheme = VALIDATION_SCHEMES.URL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid URL', () =>
        {
            const validator = new Validator();
            const data = { url: 'example.com' };
            const scheme = VALIDATION_SCHEMES.URL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_URL);
        });

        it('should reject a missing required URL', () =>
        {
            const validator = new Validator();
            const data = { url: undefined };
            const scheme = VALIDATION_SCHEMES.URL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_URL);
        });
    });

    describe('Optional values', () =>
    {
        it('should accept missing optional values', () =>
        {
            const validator = new Validator();
            const data = { string: undefined, integer: undefined, real: undefined, boolean: undefined, url: undefined };
            const scheme = VALIDATION_SCHEMES.OPTIONAL;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });
    });

    describe('Group values', () =>
    {
        it('should accept a valid group', () =>
        {
            const validator = new Validator();
            const data = { group: { string: 'source', integer: 123, boolean: true }};
            const scheme = VALIDATION_SCHEMES.GROUP;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid group', () =>
        {
            const validator = new Validator();
            const data = { group: 'group' };
            const scheme = VALIDATION_SCHEMES.GROUP;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_GROUP);
        });

        it('should reject a missing required group', () =>
        {
            const validator = new Validator();
            const data = { group: undefined };
            const scheme = VALIDATION_SCHEMES.GROUP;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_GROUP);
        });
    });

    describe('List values', () =>
    {
        it('should accept a valid list', () =>
        {
            const validator = new Validator();
            const data = { list: ['item1', 'item2', 'item3'] };
            const scheme = VALIDATION_SCHEMES.LIST;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });

        it('should reject an invalid list', () =>
        {
            const validator = new Validator();
            const data = { list: 'item1' };
            const scheme = VALIDATION_SCHEMES.LIST;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_LIST);
        });

        it('should reject an invalid list item', () =>
        {
            const validator = new Validator();
            const data = { list: ['item1', 123, 'item3'] };
            const scheme = VALIDATION_SCHEMES.LIST;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.INVALID_LIST_ITEM);
        });

        it('should reject a missing required list', () =>
        {
            const validator = new Validator();
            const data = { list: undefined };
            const scheme = VALIDATION_SCHEMES.LIST;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.MISSING_LIST);
        });
    });

    describe('Complex values', () =>
    {
        it('should accept a valid complex group', () =>
        {
            const validator = new Validator();
            const data = { complex: { source: 'source', integer: 123, boolean: true, list: ['item1', 'item2', 'item3'] }};
            const scheme = VALIDATION_SCHEMES.COMPLEX;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });
    });

    describe('Strict mode', () =>
    {
        it('should reject extra fields', () =>
        {
            const validator = new Validator();
            const data = { string: 'string', integer: 2, extra: 'extra' };
            const scheme = VALIDATION_SCHEMES.STRICT;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(VALUES.MESSAGES.EXTRA_FIELD);
        });
    })

    describe('Lenient mode', () =>
    {
        it('should accept extra fields', () =>
        {
            const validator = new Validator(false);
            const data = { string: 'string', extra: 'extra' };
            const scheme = VALIDATION_SCHEMES.LENIENT;

            const result = validator.validate(data, scheme);

            expect(result.valid).toBe(true);
        });
    });
});
