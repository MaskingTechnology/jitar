
import { describe, expect, it } from 'vitest';

import { configurationBuilder, FILENAMES, CONFIGURATIONS, ServerConfigurationInvalid, VALIDATION_RESULT } from './fixtures';

describe('server/ConfigurationBuilder', () =>
{
    it('should build a valid server configuration', async () =>
    {
        const promise = configurationBuilder.build(FILENAMES.VALID_CONFIGURATION);

        await expect(promise).resolves.toEqual(CONFIGURATIONS.RESULT.VALID);
    });

    it('should reject an invalid server configuration', async () =>
    {
        const promise = configurationBuilder.build(FILENAMES.INVALID_CONFIGURATION);

        await expect(promise).rejects.toEqual(new ServerConfigurationInvalid(VALIDATION_RESULT));
    });
});
