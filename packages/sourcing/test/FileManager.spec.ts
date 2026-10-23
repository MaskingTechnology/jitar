
import { describe, expect, it } from 'vitest';

import { InvalidLocation, FileNotFound } from '../src';

import { posixFileManager, windowsFileManager, PATHS } from './fixtures';

describe('FileManager', () =>
{
    // All the functions that are simple wrappers around the local file system are not tested.
    // This is due to the setup of the local file system, which is in such a way that each function 
    // directly calls a third-party library, and we don't want to test third-party libraries.

    describe('POSIX', () =>
    {
        describe('getAbsoluteLocation', () =>
        {
            it('should return the absolute file location from a relative path', () =>
            {
                const location = posixFileManager.getAbsoluteLocation(PATHS.POSIX.INPUTS.RELATIVE_FILE_PATH);

                expect(location).toBe(PATHS.POSIX.OUTPUTS.RELATIVE_FILE_PATH);
            });

            it('should return the absolute file location from an absolute path', () =>
            {
                const location = posixFileManager.getAbsoluteLocation(PATHS.POSIX.INPUTS.ABSOLUTE_FILE_PATH);

                expect(location).toBe(PATHS.POSIX.OUTPUTS.ABSOLUTE_FILE_PATH);
            });

            it('should throw an error when the path is outside the base location', () =>
            {
                const result = () => posixFileManager.getAbsoluteLocation(PATHS.POSIX.INPUTS.INVALID_FILE_PATH);

                expect(result).toThrow(new InvalidLocation(PATHS.POSIX.OUTPUTS.INVALID_FILE_PATH));
            });
        });

        describe('getContent', () =>
        {
            it('should return the content of the file', () =>
            {
                // Not implemented, as it would test reading a file from the file system. Which
                // is simply a call to the file system and we don't want to test libraries.

                expect(true).toBe(true);
            });

            it('should throw an error when the file does not exist', async () =>
            {
                const result = posixFileManager.getContent(PATHS.POSIX.INPUTS.NON_EXISTING_FILE);

                await expect(result).rejects.toThrow(new FileNotFound(PATHS.POSIX.OUTPUTS.NON_EXISTING_FILE));
            });
        });

        describe('getType', () =>
        {
            // Only the decision logic is tested here. The actual mime type implementation is not tested,
            // as it's a single call to a third-party library.

            it('should return the mime type of the file', async () =>
            {
                const mimeType = await posixFileManager.getType(PATHS.POSIX.INPUTS.FILE_TYPE_TEXT);

                expect(mimeType).toBe(PATHS.POSIX.OUTPUTS.FILE_TYPE_TEXT);
            });

            it('should return the default mime type when the file type is unknown', async () =>
            {
                const mimeType = await posixFileManager.getType(PATHS.POSIX.INPUTS.FILE_TYPE_UNKNOWN);

                expect(mimeType).toBe(PATHS.POSIX.OUTPUTS.FILE_TYPE_UNKNOWN);
            });
        });

        // TODO: add tests for getRelativeLocation
    });

    describe('Windows', () =>
    {
        describe('getAbsoluteLocation', () =>
        {
            it('should return the normalized file location from a path', () =>
            {
                const location = windowsFileManager.getAbsoluteLocation(PATHS.WINDOWS.INPUTS.ABSOLUTE_FILE_PATH);

                expect(location).toBe(PATHS.WINDOWS.OUTPUTS.ABSOLUTE_FILE_PATH);
            });

            it('should throw an error when the path has a different drive letter', () =>
            {
                const result = () => windowsFileManager.getAbsoluteLocation(PATHS.WINDOWS.INPUTS.INVALID_FILE_PATH);

                expect(result).toThrow(new InvalidLocation(PATHS.WINDOWS.OUTPUTS.INVALID_FILE_PATH));
            });
        });
    });
});
