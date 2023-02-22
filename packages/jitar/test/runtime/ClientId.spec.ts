
import { describe, expect, it } from 'vitest';

import ClientId from '../../src/runtime/ClientId';

describe('runtime/ClientId', () =>
{
    describe('.generate()', () =>
    {
        it('should generate a client id', () =>
        {
            const clientId = ClientId.generate();

            expect(clientId).toMatch(/^CLIENT_\d+$/);
        });

        it('should generate a different client id each time', () =>
        {
            const clientId1 = ClientId.generate();
            const clientId2 = ClientId.generate();

            expect(clientId1).not.toBe(clientId2);
        });
    });

    describe('.validate(clientId)', () =>
    {
        it('should return true if the client id is valid', () =>
        {
            expect(ClientId.validate('CLIENT_0')).toBe(true);
            expect(ClientId.validate('CLIENT_42')).toBe(true);
            expect(ClientId.validate('CLIENT_007')).toBe(true);
        });

        it('should return false if the client id is invalid', () =>
        {
            expect(ClientId.validate('CLIENT_')).toBe(false);
            expect(ClientId.validate('CLIENT_X')).toBe(false);
            expect(ClientId.validate('CLIENT_0a')).toBe(false);
            expect(ClientId.validate('CLIENT_0.1')).toBe(false);
            expect(ClientId.validate('Client_0')).toBe(false);
            expect(ClientId.validate('SERVER_0')).toBe(false);
        });
    });
});
