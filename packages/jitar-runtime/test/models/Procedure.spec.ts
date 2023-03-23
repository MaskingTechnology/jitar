
import { describe, expect, it } from 'vitest';

import Version from '../../src/models/Version';

import { PROCEDURES } from '../_fixtures/models/Procedure.fixture';

const privateProcedure = PROCEDURES.PRIVATE;
const publicProcedure = PROCEDURES.PUBLIC;
const versionedProcedure = PROCEDURES.VERSIONED;

describe('models/Procedure', () =>
{
    describe('.fqn', () =>
    {
        it('should have a fqn', () =>
        {
            expect(privateProcedure.fqn).toBe('private');
        });
    });

    describe('.public', () =>
    {
        it('should have public implementations', () =>
        {
            expect(publicProcedure.public).toBeTruthy();
        });

        it('should not have public implementations', () =>
        {
            expect(privateProcedure.public).toBeFalsy();
        });
    });

    describe('.getImplementation(version)', () =>
    {
        it('should not get a lower implementation version than the lowest registered version', () =>
        {
            const implementation = versionedProcedure.getImplementation(new Version(0, 0, 1));

            expect(implementation).toBeUndefined();
        });

        it('should get an exact version of an implementation', () =>
        {
            const implementation = versionedProcedure.getImplementation(new Version(1, 0, 0));

            expect(implementation).not.toBeUndefined();
            expect(implementation?.version.toString()).toBe('1.0.0');
        });

        it('should get a lower version of an implementation if no exact version is found', () =>
        {
            const implementation = versionedProcedure.getImplementation(new Version(1, 0, 3));

            expect(implementation).not.toBeNull();
            expect(implementation?.version.toString()).toBe('1.0.0');
        });
    });
});
