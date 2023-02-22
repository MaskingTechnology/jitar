
import ErrorManager from '../../../src/core/ErrorManager';

import { describe, expect, it } from 'vitest';

describe('core/errors/ErrorManager', () =>
{
    describe('.handle(error, name, version)', () =>
    {
        it('should contain the only message for non errors', () =>
        {
            const result = ErrorManager.handle('Hello world', 'Test', '1.0.0');

            expect(result.message).toBe('Hello world\n[Test | v1.0.0]');
        });

        it('should contain the error message', () =>
        {
            const parentError = new Error('Hello world');
            const result = ErrorManager.handle(parentError, 'Test', '1.0.0');

            expect(result.message).toBe('Hello world\n[Test | v1.0.0]');
        });

        it('should only stack the procedure trace for run error parents', () =>
        {
            const first = new Error('Hello world');
            const second = ErrorManager.handle(first, 'Sub procedure', '1.0.0');
            const result = ErrorManager.handle(second, 'Root procedure', '1.1.0');

            expect(result.message).toBe('Hello world\n[Sub procedure | v1.0.0]\n[Root procedure | v1.1.0]');
        });
    });
});
