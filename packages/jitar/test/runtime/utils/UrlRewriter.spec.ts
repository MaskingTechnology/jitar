
import UrlRewriter from '../../../src/runtime/utils/UrlRewriter';

describe('runtime/utils/UrlRewriter', () =>
{
    describe('.addBase(url, base)', () =>
    {
        it('should add the base to the url', () =>
        {
            const result = UrlRewriter.addBase('sub/my-file.ext', '/base/path/');

            expect(result).toBe('/base/path/sub/my-file.ext');
        });

        it('should add the base to the url without a slash', () =>
        {
            const result = UrlRewriter.addBase('sub/my-file.ext', '/base/path');

            expect(result).toBe('/base/path/sub/my-file.ext');
        });

        it('should add the base to the url with trailing base slash', () =>
        {
            const result = UrlRewriter.addBase('/sub/my-file.ext', '/base/path/');

            expect(result).toBe('/base/path/sub/my-file.ext');
        });

        it('should remove last path part from the base', () =>
        {
            const result = UrlRewriter.addBase('../sub/my-file.ext', '/base/path/');

            expect(result).toBe('/base/sub/my-file.ext');
        });

        it('should remove last path parts from the base', () =>
        {
            const result = UrlRewriter.addBase('../../../sub/my-file.ext', '/base/path/to/folder');

            expect(result).toBe('/base/sub/my-file.ext');
        });

        it('should remove all parts from the base', () =>
        {
            const result = UrlRewriter.addBase('../../../sub/my-file.ext', '/base/path/');

            expect(result).toBe('sub/my-file.ext');
        });

        it('should add the base to the url', () =>
        {
            const result = UrlRewriter.addBase('./sub/my-file.ext', '/base/path/');

            expect(result).toBe('/base/path/sub/my-file.ext');
        });
    });
});
