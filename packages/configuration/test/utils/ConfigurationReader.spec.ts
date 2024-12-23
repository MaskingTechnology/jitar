
import { describe, expect, it, vi } from 'vitest';

import { reader, FILENAMES, CONFIGURATIONS, InvalidConfigurationFile } from "./fixtures";

describe('ConfigurationReader', () =>
{
    it('should return default configuration for non-existing config file', async () =>
    {
        const configuration = await reader.read(FILENAMES.NON_EXISTING);

        expect(configuration).toEqual(CONFIGURATIONS.default);
    });

    it('should read json configuration', async () =>
    {
        const configuration = await reader.read(FILENAMES.CORRECT_TYPE);

        expect(configuration).toEqual(CONFIGURATIONS.result);
    });

    it('should read json configuration with environment variables', async () =>
    {
        vi.stubEnv(CONFIGURATIONS.envVariables.TARGET_PATH_ENV_UTIL_KEY, CONFIGURATIONS.envVariables.TARGET_PATH_ENV_UTIL_VALUE);

        const configuration = await reader.read(FILENAMES.ENV_VARIABLES);

        expect(configuration).toEqual(CONFIGURATIONS.envResult);

        vi.unstubAllEnvs();
    });

    it('should not except non-json files', async () =>
    {
        const promise = reader.read(FILENAMES.INCORRECT_TYPE);

        await expect(promise).rejects.toEqual(new InvalidConfigurationFile(FILENAMES.INCORRECT_TYPE));
    });
});
