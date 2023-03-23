
import { describe, expect, it } from 'vitest';

import { VERSIONS } from '../_fixtures/models/Version.fixture';

const actualVersion = VERSIONS.ACTUAL;

describe('models/Version', () =>
{
    describe('.equals(version)', () =>
    {
        it('should be equal', () =>
        {
            const equal = actualVersion.equals(VERSIONS.EQUAL);

            expect(equal).toBeTruthy();
        });

        it('should not be equal', () =>
        {
            const greaterEqual = actualVersion.equals(VERSIONS.GREATER);
            const lesserEqual = actualVersion.equals(VERSIONS.LESSER);

            expect(greaterEqual).toBeFalsy();
            expect(lesserEqual).toBeFalsy();
        });
    });

    describe('.greater(version)', () =>
    {
        it('should be greater', () =>
        {
            const equal = actualVersion.greater(VERSIONS.LESSER);

            expect(equal).toBeTruthy();
        });

        it('should not be greater', () =>
        {
            const equalEqual = actualVersion.greater(VERSIONS.EQUAL);
            const greaterEqual = actualVersion.greater(VERSIONS.GREATER);

            expect(equalEqual).toBeFalsy();
            expect(greaterEqual).toBeFalsy();
        });
    });

    describe('.less(version)', () =>
    {
        it('should be less', () =>
        {
            const equal = actualVersion.less(VERSIONS.GREATER);

            expect(equal).toBeTruthy();
        });

        it('should not be less', () =>
        {
            const equalEqual = actualVersion.less(VERSIONS.EQUAL);
            const lesserEqual = actualVersion.less(VERSIONS.LESSER);

            expect(equalEqual).toBeFalsy();
            expect(lesserEqual).toBeFalsy();
        });
    });

    // describe('.parse(number)', () =>
    // {
    //     it('should parse a major number', () =>
    //     {
    //         const version = Version.parse('1');

    //         expect(version).toEqual(majorVersion);
    //     });

    //     it('should parse a major.minor number', () =>
    //     {
    //         const version = Version.parse('1.2');

    //         expect(version).toEqual(majorMinorVersion);
    //     });

    //     it('should parse a major.minor.patch number', () =>
    //     {
    //         const version = Version.parse('1.2.3');

    //         expect(version).toEqual(actualVersion);
    //     });

    //     it('should not parse an invalid number', () =>
    //     {
    //         const run = () => Version.parse('1.2.3.4');

    //         expect(run).toThrow(new InvalidVersionNumber('1.2.3.4'));
    //     });
    // });
});
