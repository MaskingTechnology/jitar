
import { describe, expect, it, vi } from 'vitest';

import { reader, FILENAMES, CONFIGURATIONS, InvalidConfigurationFile } from "./fixtures";

describe('ConfigurationReader', () =>
{
    it('should return an empty configuration for non-existing config file', async () =>
    {
        const configuration = await reader.read(FILENAMES.NON_EXISTING);

        expect(configuration).toEqual(CONFIGURATIONS.EMPTY);
    });

    it('should read json configuration', async () =>
    {
        const configuration = await reader.read(FILENAMES.CORRECT_TYPE);

        expect(configuration).toEqual(CONFIGURATIONS.RESULT);
    });

    it('should read json configuration with environment variables', async () =>
    {
        vi.stubEnv(CONFIGURATIONS.ENV_VARIABLES.TARGET_PATH_ENV_UTIL_KEY, CONFIGURATIONS.ENV_VARIABLES.TARGET_PATH_ENV_UTIL_VALUE);

        const configuration = await reader.read(FILENAMES.ENV_VARIABLES);

        expect(configuration).toEqual(CONFIGURATIONS.ENV_RESULT);

        vi.unstubAllEnvs();
    });

    it('should not except non-json files', async () =>
    {
        const promise = reader.read(FILENAMES.INCORRECT_TYPE);

        await expect(promise).rejects.toEqual(new InvalidConfigurationFile(FILENAMES.INCORRECT_TYPE));
    });
});
