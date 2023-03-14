
import { File, FileManager, Files } from 'jitar-runtime';

import { SOURCE_FILES, SEGMENT_FILENAMES, MODULE_FILENAMES } from './SourceFiles.fixture';

class TestFileManager implements FileManager
{
    #writtenFiles: File[] = [];

    get writtenFiles() { return this.#writtenFiles; }

    getRootLocation(): string
    {
        return '';
    }

    getAbsoluteLocation(filename: string): string
    {
        return filename;
    }

    getRelativeLocation(filename: string): string
    {
        return filename;
    }

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
        const type = await this.getType(filename);
        const content = await this.getContent(filename);

        return new File(filename, type, content);
    }

    async write(filename: string, content: string): Promise<void>
    {
        const type = await this.getType(filename);
        const file = new File(filename, type, content);

        this.#writtenFiles.push(file);
    }

    delete(filename: string): Promise<void>
    {
        throw new Error(`File not deleted: ${filename}`);
    }

    async filter(pattern: string): Promise<string[]>
    {
        switch (pattern)
        {
            case Files.SEGMENT_PATTERN: return SEGMENT_FILENAMES;
            case Files.MODULE_PATTERN: return MODULE_FILENAMES;
        }

        return [];
    }
}

export { TestFileManager }
