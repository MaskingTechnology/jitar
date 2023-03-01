
export default class UrlRewriter
{
    #baseUrl: string;

    constructor(baseUrl = '/')
    {
        this.#baseUrl = this.#assureEndWithSlash(baseUrl);
    }

    rewrite(url: string): string
    {
        if (url.startsWith(this.#baseUrl))
        {
            return this.#translateRelativeParts(url);
        }

        url = this.#ensureStartsWithoutSlash(url);

        return this.#translateRelativeParts(`${this.#baseUrl}${url}`);
    }

    #ensureStartsWithoutSlash(url: string): string
    {
        if (url.startsWith('/'))
        {
            return url.substring(1);
        }

        return url;
    }

    #assureEndWithSlash(base: string): string
    {
        if (base.endsWith('/'))
        {
            return base;
        }

        return `${base}/`;
    }

    #translateRelativeParts(url: string)
    {
        const parts = url.split('/');
        const translated = [];

        translated.push(parts[0]);

        for (let index = 1; index < parts.length; index++)
        {
            const part = parts[index].trim();

            if (part === '.' || part === '')
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
