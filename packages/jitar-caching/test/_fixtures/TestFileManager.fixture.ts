
import { File, FileManager, Files } from 'jitar-runtime';

import { SOURCE_FILES, SOURCE_SEGMENT_FILENAMES, SOURCE_MODULE_FILENAMES } from './SourceFiles.fixture';

class TestFileManager implements FileManager
{
    #writtenFiles: Map<string, string> = new Map();

    get writtenFiles() { return this.#writtenFiles; }

    getRootLocation(): string
    {
        return '';
    }

    getAbsoluteLocation(filename: string): string
    {
        if (filename.startsWith('./'))
        {
            return filename;
        }

        return `./${filename}`;
    }

    getRelativeLocation(filename: string): string
    {
        return filename.substring(2);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getType(filename: string): Promise<string>
    {
        return 'file';
    }

    async getContent(filename: string): Promise<string | Buffer>
    {
        const content = SOURCE_FILES[filename];

        if (content === undefined)
        {
            throw new Error(`File not found: ${filename}`);
        }
        
        return content;
    }

    async read(filename: string): Promise<File>
    {
        const absoluteFilename = this.getAbsoluteLocation(filename);
        const type = await this.getType(filename);
        const content = await this.getContent(filename);

        return new File(absoluteFilename, type, content);
    }

    async write(filename: string, content: string): Promise<void>
    {
        const absoluteFilename = this.getAbsoluteLocation(filename);
        
        this.#writtenFiles.set(absoluteFilename, content);
    }

    delete(filename: string): Promise<void>
    {
        throw new Error(`File not deleted: ${filename}`);
    }

    async filter(pattern: string): Promise<string[]>
    {
        switch (pattern)
        {
            case Files.SEGMENT_PATTERN: return SOURCE_SEGMENT_FILENAMES;
            case Files.MODULE_PATTERN: return SOURCE_MODULE_FILENAMES;
        }

        return [];
    }
}

export { TestFileManager }
