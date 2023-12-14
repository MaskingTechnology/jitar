
export default class UrlRewriter
{
    static addBase(url: string, base: string): string
    {
        if (url.startsWith(base))
        {
            return url;
        }

        const joined = `${base}/${url}`;
        const parts = joined.split('://');

        const protocol = parts.length > 1 ? `${parts[0]}://` : '';
        const address = parts.length > 1 ? parts[1] : parts[0];
        
        const translatedAddress = this.#translateAddress(address);

        return `${protocol}${translatedAddress}`;
    }

    static removeBase(url: string, base: string): string
    {
        if (url.startsWith(base) === false)
        {
            return url;
        }

        return url.substring(base.length);
    }

    static #translateAddress(address: string)
    {
        const parts = address.split('/');
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
