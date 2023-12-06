
import { describe, expect, it } from 'vitest';

import InvalidClientId from '../../src/errors/InvalidClientId';
import ClientNotFound from '../../src/errors/ClientNotFound';

import FileNotFound from '../../src/errors/FileNotFound';
import { REPOSITORIES, REPOSITORY_FILES, CLIENT } from '../_fixtures/services/LocalRepository.fixture';

const repository = REPOSITORIES.DEFAULT;

describe('services/LocalRepository', () =>
{
    describe('.readModule(clientId, filename)', () =>
    {
        it('should not accept an invalid client id', () =>
        {
            const run = async () => repository.readModule('INVALID', '/some/file');

            expect(run).rejects.toEqual(new InvalidClientId('INVALID'));
        });

        it('should not accept an unknown client id', () =>
        {
            const run = async () => repository.readModule('CLIENT_9999', '/some/file');

            expect(run).rejects.toEqual(new ClientNotFound('CLIENT_9999'));
        });

        it('should return an unsegmented module file', async () =>
        {
            const result = await repository.readModule(CLIENT.id, REPOSITORY_FILES.UNSEGMENTED);

            expect(result.content.toString()).toContain('private()');
        });

        it('should return the actual module file', async () =>
        {
            const result = await repository.readModule(CLIENT.id, REPOSITORY_FILES.LOCAL);

            expect(result.content).toContain('first()');
        });

        it('should return a remote module file', async () =>
        {
            const result = await repository.readModule(CLIENT.id, REPOSITORY_FILES.REMOTE);

            expect(result.content.toString()).toContain('fourth()');
        });

        it('should return a public asset', async () =>
        {
            const result = await repository.loadAsset('index.html');

            expect(result.content.toString()).toContain('<h1>Hello world</h1>');
        });

        it('should not return a private asset', async () =>
        {
            const run = async () => repository.loadAsset('style.css');

            expect(run).rejects.toEqual(new FileNotFound('style.css'));
        });
    });
});
