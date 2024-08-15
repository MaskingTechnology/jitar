
const DEFAULT_EXTENSION = 'js';
const EXTENSION_PATTERN = /\.js$/;

export default class FileHelper
{
    static translatePath(filename: string)
    {
        const parts = filename.split('/');
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

    static assureExtension(filename: string, extension = DEFAULT_EXTENSION): string
    {
        return filename.endsWith(`.${extension}`) ? filename : `${filename}.${extension}`;
    }

    static assureRelativePath(filename: string): string
    {
        if (filename.startsWith('./'))
        {
            return filename;
        } 
        
        if (filename.startsWith('/'))
        {
            return `.${filename}`;
        }
        
        return `./${filename}`;
    }

    static assureAbsolutePath(filename: string): string
    {
        if (filename.startsWith('//'))
        {
            return filename;
        }

        if (filename.startsWith('./'))
        {
            filename = filename.substring(1);
        }

        return `/${filename}`;
    }

    static assureRelativeFilenameWithExtension(filename: string, extension = DEFAULT_EXTENSION): string
    {
        const relativeFilename = this.assureRelativePath(filename);

        return this.assureExtension(relativeFilename, extension);
    }

    static convertToLocalFilename(filename: string): string
    {
        return filename.replace(EXTENSION_PATTERN, '.local.js');
    }

    static convertToRemoteFilename(filename: string): string
    {
        return filename.replace(EXTENSION_PATTERN, '.remote.js');
    }

    static createWorkerFilename(name: string): string
    {
        return `./${name}.segment.js`;
    }

    static createRepositoryFilename(name: string): string
    {
        return `./${name}.segment.repository.js`;
    }

    static isSegmentFilename(filename: string): boolean
    {
        return filename.includes('.segment.');
    }
}
