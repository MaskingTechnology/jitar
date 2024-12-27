
import { describe, expect, it } from 'vitest';

import { fileManager, InvalidLocation, FileNotFound, PATHS } from './fixtures';

describe('LocalFileManager', () =>
{
    describe('getAbsoluteLocation', () =>
    {
        it('should return the absolute file location from relative path', () =>
        {
            const location = fileManager.getAbsoluteLocation(PATHS.INPUTS.RELATIVE_FILE_PATH);

            expect(location).toBe(PATHS.OUTPUTS.RELATIVE_FILE_PATH);
        });

        it('should return the absolute file location from absolute path', () =>
        {
            const location = fileManager.getAbsoluteLocation(PATHS.INPUTS.ABSOLUTE_FILE_PATH);

            expect(location).toBe(PATHS.OUTPUTS.ABSOLUTE_FILE_PATH);
        });

        it('should throw an error when path is outside the base location', () =>
        {
            const result = () => fileManager.getAbsoluteLocation(PATHS.INPUTS.INVALID_FILE_PATH);

            expect(result).toThrow(new InvalidLocation(PATHS.OUTPUTS.INVALID_FILE_PATH));
        });
    });

    describe('getContent', () =>
    {
        it('should throw an error when the file does not exist', async () =>
        {
            const result = fileManager.getContent(PATHS.INPUTS.NON_EXISTING_FILE);

            await expect(result).rejects.toThrow(new FileNotFound(PATHS.OUTPUTS.NON_EXISTING_FILE));
        });
    });

    describe('getType', () =>
    {
        it('should return the mime type of the file', async () =>
        {
            const mimeType = await fileManager.getType(PATHS.INPUTS.FILE_TYPE_TEXT);

            expect(mimeType).toBe(PATHS.OUTPUTS.FILE_TYPE_TEXT);
        });

        it('should return the default mime type when the file type is unknown', async () =>
        {
            const mimeType = await fileManager.getType(PATHS.INPUTS.FILE_TYPE_UNKNOWN);

            expect(mimeType).toBe(PATHS.OUTPUTS.FILE_TYPE_UNKNOWN);
        });
    });
});
