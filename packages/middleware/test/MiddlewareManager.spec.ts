
import { describe, expect, it } from 'vitest';

import { Request, RunModes, Version } from '@jitar/execution';

import { MIDDLEWARE_MANAGERS } from './fixtures';

const defaultManager = MIDDLEWARE_MANAGERS.DEFAULT;

describe('MiddlewareManager', () =>
{
    describe('.handle(fqn, version, args, headers', () =>
    {
        it('should execute the middleware in the correct order', async () =>
        {
            const args = new Map();
            const headers = new Map();

            const request = new Request('test', new Version(1, 0, 0), args, headers, RunModes.NORMAL);
            const response = await defaultManager.handle(request);

            expect(response.result).toBe('123');
            expect(headers.get('first')).toBe('yes');
            expect(headers.get('second')).toBe('yes');
            expect(headers.get('third')).toBe('yes');
            expect(headers.get('last')).toBe('3'); // The last middleware to be called is the last one added
        });
    });
});
