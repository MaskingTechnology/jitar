
import Version from '../../src/core/Version';
import ImplementationNotFound from '../../src/core/errors/ImplementationNotFound';

import { describe, expect, it } from 'vitest';

import
{
    rootProcedure,
    moduleProcedure,
    privateProcedure
} from '../_fixtures/core/Procedure.fixture';

describe('core/Procedure', () =>
{
    describe('.module', () =>
    {
        it('should have an empty module', () =>
        {
            expect(rootProcedure.module).toBe('');
        });

        it('should have a defined module', () =>
        {
            expect(moduleProcedure.module).toBe('my/module');
        });
    });

    describe('.name', () =>
    {
        it('should have the defined name', () =>
        {
            expect(rootProcedure.name).toBe('myRootProcedure');
            expect(moduleProcedure.name).toBe('myModuleProcedure');
        });
    });

    describe('.fqn', () =>
    {
        it('should have its name only when no module is defined', () =>
        {
            expect(rootProcedure.fqn).toBe('myRootProcedure');
        });

        it('should have a combination of module and name when a module is defined', () =>
        {
            expect(moduleProcedure.fqn).toBe('my/module/myModuleProcedure');
        });
    });

    describe('.public', () =>
    {
        it('should have public implementations', () =>
        {
            expect(rootProcedure.public).toBeTruthy();
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
            const implementation = rootProcedure.getImplementation(new Version(0, 0, 1));

            expect(implementation).toBeUndefined();
        });

        it('should get an exact version of an implementation', () =>
        {
            const implementation = rootProcedure.getImplementation(new Version(1, 0, 0));

            expect(implementation).not.toBeUndefined();
            expect(implementation?.version.toString()).toBe('1.0.0');
        });

        it('should get a lower version of an implementation if no exact version is found', () =>
        {
            const implementation = rootProcedure.getImplementation(new Version(1, 0, 3));

            expect(implementation).not.toBeNull();
            expect(implementation?.version.toString()).toBe('1.0.0');
        });
    });

    describe('.run(name, version, headers)', () =>
    {
        it('should run a procedure', async () =>
        {
            const v1_0_0 = await rootProcedure.run(new Version(1, 0, 0), new Map(), new Map());
            const v1_0_5 = await rootProcedure.run(new Version(1, 0, 5), new Map(), new Map());
            const v1_1_0 = await rootProcedure.run(new Version(1, 1, 0), new Map(), new Map());

            expect(v1_0_0).toBe('1.0.0');
            expect(v1_0_5).toBe('1.0.5');
            expect(v1_1_0).toBe('1.1.0');
        });

        it('throw a implementation not found error', async () =>
        {
            const run = async () => await rootProcedure.run(new Version(0, 0, 1), new Map(), new Map());

            expect(run).rejects.toEqual(new ImplementationNotFound('myRootProcedure', '0.0.1'));
        });
    });
});
