
import { describe, expect, it } from 'vitest';

import RunModes from '../src/definitions/RunModes';
import InvalidSegment from '../src/errors/InvalidSegment';
import ImplementationNotFound from '../src/errors/ImplementationNotFound';
import ProcedureNotFound from '../src/errors/ProcedureNotFound';
import Request from '../src/models/Request';
import Version from '../src/models/Version';
import type Segment from '../src/models/Segment';

import { EXECUTION_MANAGERS } from './fixtures';

const executionManager = EXECUTION_MANAGERS.GENERAL;

describe('ExecutionManager', () =>
{
    describe('.addSegment(segment)', () =>
    {
        // Adding a valid segment is already done in the fixture

        it('should not add an invalid segment', async () =>
        {
            const promise = executionManager.addSegment({} as Segment);

            await expect(promise).rejects.toEqual(new InvalidSegment());
        });
    });

    describe('.run(request)', () =>
    {
        it('should run an existing procedure implementation', async () =>
        {
            const request = new Request('public', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const response = await executionManager.run(request);

            await expect(response.result).toBe('public');
        });

        it('should not run a non-existing procedure', async () =>
        {
            const request = new Request('nonExisting', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = executionManager.run(request);

            await expect(promise).rejects.toEqual(new ProcedureNotFound('nonExisting'));
        });

        it('should not run a non-existing implementation', async () =>
        {
            const request = new Request('versioned', Version.DEFAULT, new Map(), new Map(), RunModes.NORMAL);

            const promise = executionManager.run(request);

            await expect(promise).rejects.toEqual(new ImplementationNotFound('versioned', Version.DEFAULT.toString()));
        });

        it('should perform a dry-run', async () =>
        {
            const request = new Request('public', Version.DEFAULT, new Map(), new Map(), RunModes.DRY);

            const response = await executionManager.run(request);

            await expect(response.result).toBeUndefined();
        });
    });
});
