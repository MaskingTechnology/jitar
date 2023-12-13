
export default class UrlRewriter
{
    static addBase(url: string, base: string): string
    {
        const joined = `${base}/${url}`;
        const parts = joined.split('://');

        const protocol = parts.length > 1 ? `${parts[0]}://` : '';
        const path = parts.length > 1 ? parts[1] : parts[0];
        
        const translatedPath = this.#translateRelativePath(path);

        return `${protocol}${translatedPath}`;
    }

    static #translateRelativePath(path: string)
    {
        const parts = path.split('/');
        const translated = [];

        translated.push(parts[0]);

        for (let index = 1; index < parts.length; index++)
        {
            const part = parts[index].trim();

            switch (part)
            {
                case '': continue;
                case '.': continue;
                case '..': translated.pop(); continue;
            }

            translated.push(part);
        }

        return translated.join('/');
    }
}
