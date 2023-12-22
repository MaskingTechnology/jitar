
export default class StringSanitizer
{
    static sanitize(contents: string): string
    {
        return contents
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;');
    }
}
