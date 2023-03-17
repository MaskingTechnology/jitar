
import File from '../../../src/models/File';
import FileLoader from '../../../src/interfaces/FileManager';
import LocalRepository from '../../../src/services/LocalRepository';

class TestFileManager implements FileLoader
{
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
        return 'application/javascript';
    }

    async getContent(filename: string): Promise<Buffer | string>
    {
        switch (filename)
        {
            case 'fourthPrivateTask.js':
                return Buffer.from('fourthPrivateTask()');

            case 'firstPublicTask.local.js':
                return Buffer.from('firstPublicTask()');

            case 'secondPublicTask.remote.js':
                return Buffer.from('runProcedure()');
            case 'index.html':
                return Buffer.from('<html><body><p>Hello world</p></script></body></html>');
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

const fileManager = new TestFileManager();
const assetList = ['index.html'];
const repository = new LocalRepository(fileManager, assetList);
const client = { id: '' };

repository.registerSegment('first', ['firstPrivateTask.js', 'firstPublicTask.js', 'thirdPublicTask.js']);
repository.registerSegment('second', ['secondPrivateTask.js', 'secondPublicTask.js', 'fourthPublicTask.js']);
repository.registerClient(['first']).then(clientId => client.id = clientId);

const UNSEGMENTED_FILE = 'fourthPrivateTask.js';
const LOCAL_FILE = 'firstPublicTask.js';
const REMOTE_FILE = 'secondPublicTask.js';

export { repository, client, UNSEGMENTED_FILE, LOCAL_FILE, REMOTE_FILE }
