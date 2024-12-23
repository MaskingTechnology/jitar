
import { describe, expect, it } from 'vitest';

import { configurationBuilder, FILENAMES, CONFIGURATIONS, RuntimeConfigurationInvalid, VALIDATION_RESULT } from './fixtures';

describe('ConfigurationBuilder', () =>
{

    it('should build a default runtime configuration without configuration file', async () =>
    {
        const promise = configurationBuilder.build();

        await expect(promise).resolves.toEqual(CONFIGURATIONS.DEFAULT);
    });

    it('should build a valid runtime configuration', async () =>
    {
        const promise = configurationBuilder.build(FILENAMES.VALID);

        await expect(promise).resolves.toEqual(CONFIGURATIONS.RUNTIME);
    });

    it('should build a default runtime when the configuration file does not exist', async () =>
    {
        const promise = configurationBuilder.build(FILENAMES.MISSING);

        await expect(promise).resolves.toEqual(CONFIGURATIONS.DEFAULT);
    });

    it('should reject an invalid runtime configuration', async () =>
    {
        const promise = configurationBuilder.build(FILENAMES.INVALID);

        await expect(promise).rejects.toEqual(new RuntimeConfigurationInvalid(VALIDATION_RESULT));
    });
});
