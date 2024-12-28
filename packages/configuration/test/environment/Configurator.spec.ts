
import { describe, expect, it } from 'vitest';

describe('Configurator', () =>
{
    it('should not test standard library functions', async () =>
    {
        expect(true).toBeTruthy();
    });
});
