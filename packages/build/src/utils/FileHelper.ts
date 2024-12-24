
const DEFAULT_EXTENSION = 'js';
const EXTENSION_PATTERN = /\.js$/;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

export default class FileHelper
{
    translatePath(filename: string)
    {
        const parts = filename.split('/');
        const translated = [];

        for (const part of parts)
        {
            const cleanPart = part.trim();

            switch (cleanPart)
            {
                case '': continue;
                case '.': continue;
                case '..': translated.pop(); continue;
            }

            translated.push(part);
        }

        return translated.join('/');
    }

    makePathRelative(absoluteFilename: string, relativeToPath: string): string
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

    makePathAbsolute(relativeFilename: string, relativeToPath: string): string
    {
        const fullPath = relativeToPath !== ''
            ? `${relativeToPath}/${relativeFilename}`
            : relativeFilename;

        return this.translatePath(fullPath);
    }

    extractPath(filename: string)
    {
        return filename.split('/').slice(0, -1).join('/');
    }

    extractFilename(filename: string)
    {
        return filename.split('/').pop();
    }

    assureExtension(filename: string): string
    {
        return filename.endsWith(`.${DEFAULT_EXTENSION}`) ? filename : `${filename}.${DEFAULT_EXTENSION}`;
    }

    addSubExtension(filename: string, subExtension: string): string
    {
        return filename.replace(EXTENSION_PATTERN, `.${subExtension}.${DEFAULT_EXTENSION}`);
    }

    isApplicationModule(from: string): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some(indicator => from.startsWith(indicator));
    }
}
