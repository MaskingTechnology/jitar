
import ProcedureNotFound from '../../src/core/errors/ProcedureNotFound';
import Version from '../../src/core/Version';

import { segment } from '../_fixtures/core/Segment.fixture';

import { describe, expect, it } from 'vitest';

describe('core/Segment', () =>
{
    describe('.hasProcedure', () =>
    {
        it('should have a public procedure', async () =>
        {
            const hasProcedure = segment.hasProcedure('getPublic');

            expect(hasProcedure).toBeTruthy();
        });

        it('should have a private procedure', async () =>
        {
            const hasProcedure = segment.hasProcedure('getPrivate');

            expect(hasProcedure).toBeTruthy();
        });

        it('should have modulerized procedures', async () =>
        {
            const hasProcedure = segment.hasProcedure('my/module/getModule');

            expect(hasProcedure).toBeTruthy();
        });
    });

    describe('.getPublicProcedures()', () =>
    {
        it('should return public procedures only', async () =>
        {
            const procedures = segment.getPublicProcedures();

            expect(procedures.length).toBe(1);
            expect(procedures[0].fqn).toBe('getPublic');
        });
    });

    describe('.run(name, version, args, headers)', () =>
    {
        it('should run a public procedure', async () =>
        {
            const result = await segment.run('getPublic', Version.DEFAULT, new Map(), new Map());

            expect(result).toBe('public');
        });

        it('should run a private procedure', async () =>
        {
            const result = await segment.run('getPrivate', Version.DEFAULT, new Map(), new Map());

            expect(result).toBe('private');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const run = async () => await segment.run('noImplementation', Version.DEFAULT, new Map(), new Map());

            expect(run).rejects.toEqual(new ProcedureNotFound('noImplementation'));
        });

        it('should not run a broken procedure', async () =>
        {
            const run = async () => await segment.run('throwError', Version.DEFAULT, new Map(), new Map());

            expect(run).rejects.toEqual(new Error('broken\n[throwError | v0.0.0]'));
        });
    });
});
