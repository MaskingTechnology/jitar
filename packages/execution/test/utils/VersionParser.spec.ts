
import { describe, expect, it } from 'vitest';

import InvalidVersionNumber from '../../src/errors/InvalidVersionNumber';
import VersionParser from '../../src/utils/VersionParser';

import { VERSIONS } from './fixtures';

const versionParser = new VersionParser();

describe('utils/versionParser', () =>
{
    describe('.parse(number)', () =>
    {
        it('should parse a default version for an empty string', () =>
        {
            const version = versionParser.parse('');

            expect(version).toEqual(VERSIONS.DEFAULT);
        });

        it('should parse a major number', () =>
        {
            const version = versionParser.parse('1');

            expect(version).toEqual(VERSIONS.MAJOR);
        });

        it('should parse a major.minor number', () =>
        {
            const version = versionParser.parse('1.2');

            expect(version).toEqual(VERSIONS.MAJOR_MINOR);
        });

        it('should parse a major.minor.patch number', () =>
        {
            const version = versionParser.parse('1.2.3');

            expect(version).toEqual(VERSIONS.ACTUAL);
        });

        it('should not parse an invalid number', () =>
        {
            const run = () => versionParser.parse('1.2.3.4');

            expect(run).toThrow(new InvalidVersionNumber('1.2.3.4'));
        });

        it('should not parse an invalid number', () =>
        {
            const run = () => versionParser.parse('1.2.a');

            expect(run).toThrow(new InvalidVersionNumber('1.2.a'));
        });
    });
});
