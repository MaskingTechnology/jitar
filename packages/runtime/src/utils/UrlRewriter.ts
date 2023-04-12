
export default class UrlRewriter
{
    static addBase(url: string, base: string): string
    {
        url = this.#ensureStartsWithoutSlash(url);
        base = this.#assureEndWithSlash(base);

        return this.#translateRelativeParts(`${base}${url}`);
    }

    static #ensureStartsWithoutSlash(url: string): string
    {
        if (url.startsWith('/'))
        {
            return url.substring(1);
        }

        return url;
    }

    static #assureEndWithSlash(base: string): string
    {
        if (base.endsWith('/'))
        {
            return base;
        }

        return `${base}/`;
    }

    static #translateRelativeParts(url: string)
    {
        const parts = url.split('/');
        const translated = [];

        translated.push(parts[0]);

        for (let index = 1; index < parts.length; index++)
        {
            const part = parts[index].trim();

            if (part === '.')
            {
                continue;
            }
            else if (part === '..')
            {
                translated.pop();

                continue;
            }

            translated.push(part);
        }

        return translated.join('/');
    }
}
