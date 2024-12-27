
import { describe, expect, it, vi, beforeEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import mime from 'mime-types';

import { InvalidPath, FileNotFound, PATHS } from './fixtures';
import { LocalFileManager } from '../src';

vi.mock('fs-extra', () =>
{
    return {
        default: {
            readFile: vi.fn(),
            existsSync: vi.fn()
        }
    }
});

vi.mock('path', () =>
{
    return {
        default: {
            resolve: vi.fn(),
            join: vi.fn()
        }
    }
});

vi.mock('mime-types', () =>
{
    return {
        default: {
            lookup: vi.fn()
        }
    }
});

vi.mocked(path.resolve).mockReturnValue(PATHS.CONFIGS.ABSOLUTE_PATH);
const fileManager = new LocalFileManager(PATHS.CONFIGS.BASE_LOCATION);

describe('LocalFileManager', () =>
{
    beforeEach(() => 
    {
        vi.clearAllMocks();
    });

    describe('getAbsoluteLocation', () =>
    {
        it('should return the absolute file location from relative path', async () =>
        {
            vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.RELATIVE_FILE_PATH);
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.RELATIVE_FILE_PATH);

            const absolutePath = fileManager.getAbsoluteLocation(PATHS.INPUTS.RELATIVE_FILE_PATH);

            expect(absolutePath).toBe(PATHS.OUTPUTS.RELATIVE_FILE_PATH);
        });

        it('should not return the absolute file path when outside the base location', () =>
        {
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.ABSOLUTE_FILE_PATH);

            const result = () => fileManager.getAbsoluteLocation(PATHS.INPUTS.ABSOLUTE_FILE_PATH);

            expect(result).toThrow(new InvalidPath(PATHS.OUTPUTS.ABSOLUTE_FILE_PATH));
        });

        it('should not allow path traversal', () =>
        {
            vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.PATH_TRAVERSAL);
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.PATH_TRAVERSAL);

            const result = () => fileManager.getAbsoluteLocation(PATHS.INPUTS.PATH_TRAVERSAL);

            expect(result).toThrow(new InvalidPath(PATHS.OUTPUTS.PATH_TRAVERSAL));
            expect(path.join).toHaveBeenCalledWith(PATHS.CONFIGS.BASE_LOCATION, PATHS.INPUTS.PATH_TRAVERSAL);
        });
    });

    describe('getContent', () =>
    {
        it('should throw an error when the file does not exist', async () =>
        {
            vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.NON_EXISTING_FILE);
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.NON_EXISTING_FILE);
            vi.mocked(fs.existsSync).mockReturnValue(PATHS.MOCKS.EXISTS.NON_EXISTING_FILE);

            const result = fileManager.getContent(PATHS.INPUTS.NON_EXISTING_FILE);

            await expect(result).rejects.toThrow(new FileNotFound(PATHS.OUTPUTS.NON_EXISTING_FILE));
        });
    });

    describe('getType', () =>
    {
        it('should return the mime type of the file', async () =>
        {
            vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.FILE_TYPE_TEXT);
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.FILE_TYPE_TEXT);
            vi.mocked(mime.lookup).mockReturnValue(PATHS.MOCKS.LOOKUP.FILE_TYPE_TEXT);

            const mimeType = await fileManager.getType(PATHS.INPUTS.FILE_TYPE_TEXT);

            expect(mimeType).toBe(PATHS.OUTPUTS.FILE_TYPE_TEXT);
        });

        it('should return the default mime type when the file type is unknown', async () =>
        {
            vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.FILE_TYPE_UNKNOWN);
            vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.FILE_TYPE_UNKNOWN);
            vi.mocked(mime.lookup).mockReturnValue(PATHS.MOCKS.LOOKUP.FILE_TYPE_UNKNOWN);

            const mimeType = await fileManager.getType(PATHS.INPUTS.FILE_TYPE_UNKNOWN);

            expect(mimeType).toBe(PATHS.OUTPUTS.FILE_TYPE_UNKNOWN);
        });
    });
});
