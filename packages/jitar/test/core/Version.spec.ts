
import Version from '../../src/core/Version';
import InvalidVersionNumber from '../../src/core/errors/InvalidVersionNumber';

import
{
    actualVersion,
    equalVersion,
    greaterVersion,
    lesserVersion,
    majorMinorVersion,
    majorVersion
} from '../_fixtures/core/Version.fixture';

import { describe, expect, it } from 'vitest';

describe('core/Version', () =>
{
    describe('.equals(version)', () =>
    {
        it('should be equal', () =>
        {
            const equal = actualVersion.equals(equalVersion);

            expect(equal).toBeTruthy();
        });

        it('should not be equal', () =>
        {
            const greaterEqual = actualVersion.equals(greaterVersion);
            const lesserEqual = actualVersion.equals(lesserVersion);

            expect(greaterEqual).toBeFalsy();
            expect(lesserEqual).toBeFalsy();
        });
    });

    describe('.greater(version)', () =>
    {
        it('should be greater', () =>
        {
            const equal = actualVersion.greater(lesserVersion);

            expect(equal).toBeTruthy();
        });

        it('should not be greater', () =>
        {
            const equalEqual = actualVersion.greater(equalVersion);
            const greaterEqual = actualVersion.greater(greaterVersion);

            expect(equalEqual).toBeFalsy();
            expect(greaterEqual).toBeFalsy();
        });
    });

    describe('.less(version)', () =>
    {
        it('should be less', () =>
        {
            const equal = actualVersion.less(greaterVersion);

            expect(equal).toBeTruthy();
        });

        it('should not be less', () =>
        {
            const equalEqual = actualVersion.less(equalVersion);
            const lesserEqual = actualVersion.less(lesserVersion);

            expect(equalEqual).toBeFalsy();
            expect(lesserEqual).toBeFalsy();
        });
    });

    describe('.parse(number)', () =>
    {
        it('should parse a major number', () =>
        {
            const version = Version.parse('1');

            expect(version).toEqual(majorVersion);
        });

        it('should parse a major.minor number', () =>
        {
            const version = Version.parse('1.2');

            expect(version).toEqual(majorMinorVersion);
        });

        it('should parse a major.minor.patch number', () =>
        {
            const version = Version.parse('1.2.3');

            expect(version).toEqual(actualVersion);
        });

        it('should not parse an invalid number', () =>
        {
            const run = () => Version.parse('1.2.3.4');

            expect(run).toThrow(new InvalidVersionNumber('1.2.3.4'));
        });
    });
});
