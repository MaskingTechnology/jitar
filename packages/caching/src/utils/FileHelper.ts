
const DEFAULT_EXTENSION = 'js';
const EXTENSION_PATTERN = /\.js$/;

export default class FileHelper
{
    static translatePath(filename: string)
    {
        const parts = filename.split('/');
        const translated = [];

        for (let index = 0; index < parts.length; index++)
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

    static makePathRelative(absoluteFilename: string, relativeToPath: string): string
    {
        if (relativeToPath === '')
        {
            return `./${absoluteFilename}`;
        }
        
        const absoluteFilenameParts = absoluteFilename.split('/');
        const relativeToParts = relativeToPath.split('/');

        while (absoluteFilenameParts[0] === relativeToParts[0])
        {
            absoluteFilenameParts.shift();
            relativeToParts.shift();
        }

        const relativePath = relativeToParts.map(() => '..').join('/');

        const prefix = relativeToParts.length > 0 ? relativePath : '.';
        const suffix = absoluteFilenameParts.join('/');

        return `${prefix}/${suffix}`;
    }

    static makePathAbsolute(relativeFilename: string, relativeToPath: string): string
    {
        const fullPath = relativeToPath !== ''
            ? `${relativeToPath}/${relativeFilename}`
            : relativeFilename;

        return this.translatePath(fullPath);
    }

    static extractPath(filename: string)
    {
        return filename.split('/').slice(0, -1).join('/');
    }

    static extractFilename(filename: string)
    {
        return filename.split('/').pop();
    }

    static assureExtension(filename: string): string
    {
        return filename.endsWith(`.${DEFAULT_EXTENSION}`) ? filename : `${filename}.${DEFAULT_EXTENSION}`;
    }

    static addSubExtension(filename: string, subExtension: string): string
    {
        return filename.replace(EXTENSION_PATTERN, `.${subExtension}.${DEFAULT_EXTENSION}`);
    }
}
