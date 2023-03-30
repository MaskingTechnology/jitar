
import FileManager from '../../../src/interfaces/FileManager';
import File from '../../../src/models/File';

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
        return filename;
    }

    getRelativeLocation(filename: string): string 
    {
        return filename;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getType(filename: string): Promise<string>
    {
        return 'file';
    }

    async getContent(filename: string): Promise<string | Buffer>
    {
        switch (filename)
        {
            case 'private.local.js':
                return Buffer.from('private()');

            case 'first.local.js':
                return Buffer.from('first()');

            case 'fourth.remote.js':
                return Buffer.from('fourth()');
            
            case 'index.html':
                return Buffer.from('<h1>Hello world</h1>');
        }

        return Buffer.from('');
    }

    async read(filename: string): Promise<File>
    {
        const type = await this.getType(filename);
        const content = await this.getContent(filename);

        return new File(filename, type, content);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async write(filename: string, content: string): Promise<void>
    {
        // Do nothing
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async delete(filename: string): Promise<void>
    {
        // Do nothing
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async filter(pattern: string): Promise<string[]>
    {
        return [];
    }
}

export { TestFileManager }
