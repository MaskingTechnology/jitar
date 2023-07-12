
import { describe, expect, it } from 'vitest';

import UrlRewriter from '../../src/utils/UrlRewriter';

const BASE_PATH = '/base/path/';
const MY_FILE = 'sub/my-file.ext';
const FULL_PATH = '/base/path/sub/my-file.ext';

describe('runtime/utils/UrlRewriter', () =>
{
    describe('.addBase(url, base)', () =>
    {
        it('should add the base to the url', () =>
        {
            const result = UrlRewriter.addBase(MY_FILE, BASE_PATH);

            expect(result).toBe(FULL_PATH);
        });

        it('should add the base to the url without a slash', () =>
        {
            const result = UrlRewriter.addBase(MY_FILE, '/base/path');

            expect(result).toBe(FULL_PATH);
        });

        it('should add the base to the url with trailing base slash', () =>
        {
            const result = UrlRewriter.addBase('/sub/my-file.ext', BASE_PATH);

            expect(result).toBe(FULL_PATH);
        });

        it('should remove last path part from the base', () =>
        {
            const result = UrlRewriter.addBase('../sub/my-file.ext', BASE_PATH);

            expect(result).toBe('/base/sub/my-file.ext');
        });

        it('should remove last path parts from the base', () =>
        {
            const result = UrlRewriter.addBase('../../../sub/my-file.ext', '/base/path/to/folder');

            expect(result).toBe('/base/sub/my-file.ext');
        });

        it('should remove all parts from the base', () =>
        {
            const result = UrlRewriter.addBase('../../../sub/my-file.ext', BASE_PATH);

            expect(result).toBe(MY_FILE);
        });

        it('should add the base to the url', () =>
        {
            const result = UrlRewriter.addBase('./sub/my-file.ext', BASE_PATH);

            expect(result).toBe(FULL_PATH);
        });
    });
});
