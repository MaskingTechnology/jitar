
import { describe, expect, it } from 'vitest';

import
{
    privateImplementation,
    publicImplementation,
    parameterImplementation
} from '../_fixtures/models/Implementation.fixture';

describe('models/Implementation', () =>
{
    describe('.version', () =>
    {
        it('should have a version', () =>
        {
            expect(privateImplementation.version.toString()).toBe('0.0.0');
        });
    });

    describe('.public', () =>
    {
        it('should be private', () =>
        {
            expect(privateImplementation.public).toBe(false);
        });

        it('should be public', () =>
        {
            expect(publicImplementation.public).toBe(true);
        });
    });

    describe('.parameters', () =>
    {
        it('should have no parameters', () =>
        {
            const parameters = publicImplementation.parameters;

            expect(parameters.length).toBe(0);
        });

        it('should have parameters', () =>
        {
            const parameters = parameterImplementation.parameters;

            expect(parameters.length).toBe(2);

            expect(parameters[0].name).toBe('mandatory');
            expect(parameters[0].isOptional).toBe(false);

            expect(parameters[1].name).toBe('optional');
            expect(parameters[1].isOptional).toBe(true);
        });
    });
});
