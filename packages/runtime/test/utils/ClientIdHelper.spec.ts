
import { describe, expect, it } from 'vitest';

import ClientIdHelper from '../../src/utils/ClientIdHelper';

const clientIdHelper = new ClientIdHelper();

describe('services/ClientId', () =>
{
    describe('.generate()', () =>
    {
        it('should generate a client id', () =>
        {
            const clientId = clientIdHelper.generate();

            expect(clientId).toMatch(/^CLIENT_\d+$/);
        });

        it('should generate a different client id each time', () =>
        {
            const clientId1 = clientIdHelper.generate();
            const clientId2 = clientIdHelper.generate();

            expect(clientId1).not.toBe(clientId2);
        });
    });

    describe('.validate(clientId)', () =>
    {
        it('should return true if the client id is valid', () =>
        {
            expect(clientIdHelper.validate('CLIENT_0')).toBe(true);
            expect(clientIdHelper.validate('CLIENT_42')).toBe(true);
            expect(clientIdHelper.validate('CLIENT_007')).toBe(true);
        });

        it('should return false if the client id is invalid', () =>
        {
            expect(clientIdHelper.validate('CLIENT_')).toBe(false);
            expect(clientIdHelper.validate('CLIENT_X')).toBe(false);
            expect(clientIdHelper.validate('CLIENT_0a')).toBe(false);
            expect(clientIdHelper.validate('CLIENT_0.1')).toBe(false);
            expect(clientIdHelper.validate('Client_0')).toBe(false);
            expect(clientIdHelper.validate('SERVER_0')).toBe(false);
        });
    });
});
