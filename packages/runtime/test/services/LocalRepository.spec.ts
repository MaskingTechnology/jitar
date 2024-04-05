
import { describe, expect, it } from 'vitest';

import FileNotFound from '../../src/errors/FileNotFound';
import { REPOSITORIES, REPOSITORY_FILES } from '../_fixtures/services/LocalRepository.fixture';

const repository = REPOSITORIES.DEFAULT;

describe('services/LocalRepository', () =>
{
    describe('.readModule(clientId, filename)', () =>
    {
        it('should return an unsegmented module file', async () =>
        {
            const result = await repository.readModule(REPOSITORY_FILES.UNSEGMENTED, CLIENT.id);

            expect(result.content.toString()).toContain('private()');
        });

        it('should return the actual module file', async () =>
        {
            const result = await repository.readModule(REPOSITORY_FILES.LOCAL, CLIENT.id);

            expect(result.content).toContain('first()');
        });

        it('should return a remote module file', async () =>
        {
            const result = await repository.readModule(REPOSITORY_FILES.REMOTE, CLIENT.id);

            expect(result.content.toString()).toContain('fourth()');
        });

        it('should return a public asset', async () =>
        {
            const result = await repository.readAsset('index.html');

            expect(result.content.toString()).toContain('<h1>Hello world</h1>');
        });

        it('should not return a private asset', async () =>
        {
            const run = async () => repository.readAsset('style.css');

            expect(run).rejects.toEqual(new FileNotFound('style.css'));
        });
    });
});
