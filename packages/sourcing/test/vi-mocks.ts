
import { describe, expect, it, vi, beforeEach } from 'vitest';
import path from 'path';
import { InvalidPath, FileNotFound, PATHS } from './fixtures';
import { LocalFileManager } from '../src';

// vi.mock('path', () =>
// {
//     return {
//         default: {
//             resolve: vi.fn(),
//             join: vi.fn()
//         }
//     }
// });

// vi.mocked(path.resolve).mockReturnValue(PATHS.CONFIGS.ABSOLUTE_PATH);
const fileManager = new LocalFileManager(PATHS.CONFIGS.BASE_LOCATION);

describe('LocalFileManager', () =>
{
    beforeEach(() => 
    {
        vi.clearAllMocks();
    });

    // describe('getAbsoluteLocation', () =>
    // {
    //     it('should return the absolute file location from relative path', async () =>
    //     {
    //         vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.VALID_FILE_PATH);
    //         vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.VALID_FILE_PATH);

    //         const absolutePath = fileManager.getAbsoluteLocation(PATHS.INPUTS.VALID_FILE_PATH);

    //         expect(absolutePath).toBe(PATHS.OUTPUTS.VALID_FILE_PATH);
    //     });

    //     it('should not return the absolute file path when outside the base location', () =>
    //     {
    //         vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.INVALID_ABSOLUTE_FILE_PATH);

    //         const result = () => fileManager.getAbsoluteLocation(PATHS.INPUTS.INVALID_ABSOLUTE_FILE_PATH);

    //         expect(result).toThrow(new InvalidPath(PATHS.OUTPUTS.INVALID_ABSOLUTE_FILE_PATH));
    //     });

        it('should not allow path traversal', () =>
        {
            //vi.mocked(path.join).mockReturnValue(PATHS.MOCKS.JOIN.PATH_TRAVERSAL);
            //vi.mocked(path.resolve).mockReturnValue(PATHS.MOCKS.RESOLVE.PATH_TRAVERSAL);

            const result = () => fileManager.getAbsoluteLocation(PATHS.INPUTS.PATH_TRAVERSAL);

            expect(result).toThrow(new InvalidPath(PATHS.OUTPUTS.PATH_TRAVERSAL));
            //expect(path.join).toHaveBeenCalledWith(PATHS.CONFIGS.BASE_LOCATION, PATHS.INPUTS.PATH_TRAVERSAL);
        });
    // });

    describe('getType', () =>
    {
        it('should return the mime type of the file', async () =>
        {
            const mimeType = await fileManager.getType('./files/test.bin');

            expect(mimeType).toBe('application/octet-stream');
        });
    });
});
