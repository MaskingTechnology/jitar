
import { describe, expect, it } from 'vitest';

import { REQUESTS, remote, CONTENT_TYPE } from '../_fixtures/services/Remote.fixture';

describe('services/Remote', () =>
{
    describe('.run', () =>
    {
        it('should return the response as boolean', async() =>
        {
            const response = await remote.run(REQUESTS.BOOLEAN_REQUEST);

            expect(response.result).toBe(false);
            expect(response.getHeader(CONTENT_TYPE)).toBe('application/boolean');
        });

        it('should return the response as number', async() =>
        {
            const response = await remote.run(REQUESTS.NUMBER_REQUEST);

            expect(response.result).toBe(42);
            expect(response.getHeader(CONTENT_TYPE)).toBe('application/number');
        });

        it('should return the response as object', async() =>
        {
            const response = await remote.run(REQUESTS.OBJECT_REQUEST);

            expect(response.result).toEqual({ result: 42 });
            expect(response.getHeader(CONTENT_TYPE)).toBe('application/json');
        });

        it('should return the response as string', async() =>
        {
            const response = await remote.run(REQUESTS.DEFAULT_REQUEST);

            expect(response.result).toBe('Sorry, try again');
            expect(response.getHeader(CONTENT_TYPE)).toBe('text/plain');
        });
    });
});
