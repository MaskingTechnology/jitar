
import { describe, expect, it } from 'vitest';

import Version from '../../src/models/Version';

import { RUNTIMES } from '../_fixtures/services/ProcedureRuntime.fixture';

const runtime = RUNTIMES.MIDDLEWARE;

describe('services/ProcedureRuntime', () =>
{
    describe('.handle(fqn, version, args, headers', () =>
    {
        it('should execute the middleware in the correct order', async () =>
        {
            const args = new Map();
            const headers = new Map();

            const result = await runtime.handle('test', new Version(1, 0, 0), args, headers);

            expect(result).toBe('123');
            expect(headers.get('first')).toBe('yes');
            expect(headers.get('second')).toBe('yes');
            expect(headers.get('third')).toBe('yes');
            expect(headers.get('last')).toBe('1'); // The last middleware to be called is the first one to be added
        });
    });
});
