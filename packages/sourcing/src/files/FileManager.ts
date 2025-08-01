
import InvalidLocation from './errors/InvalidLocation';
import FileNotFound from './errors/FileNotFound';

import FileReader from './interfaces/FileReader';
import FileSystem from './interfaces/FileSystem';

import File from './models/File';

const DEFAULT_MIME_TYPE = 'application/octet-stream';

export default class FileManager implements FileReader
{
    readonly #location: string;
    readonly #rootLocation: string;
    readonly #fileSystem: FileSystem;

    constructor(location: string, fileSystem: FileSystem)
    {
        const rootLocation = fileSystem.resolve(location);
        
        this.#location = fileSystem.normalize(location);
        this.#rootLocation = fileSystem.normalize(rootLocation);
        this.#fileSystem = fileSystem;
    }

    // This method must be used by every function that needs to access
    // the file system. This ensures that the path is always validated
    // and prevents access to files outside of the base location.
    getAbsoluteLocation(filename: string): string
    {
        const location = this.#fileSystem.isAbsolute(filename) ? filename : this.#fileSystem.join(this.#location, filename);
        const absolutePath = this.#fileSystem.resolve(location);
        const normalizedPath = this.#fileSystem.normalize(absolutePath);

        this.#validateLocation(normalizedPath, filename);

        return normalizedPath;
    }

    getRelativeLocation(filename: string): string
    {
        const location = this.#fileSystem.relative(this.#location, filename);

        return this.#fileSystem.normalize(location);
    }

    normalizeLocation(location: string): string
    {
        return this.#fileSystem.normalize(location);
    }

    async getType(filename: string): Promise<string>
    {
        const location = this.getAbsoluteLocation(filename);
        const type = await this.#fileSystem.mimeType(location);
        
        return type ?? DEFAULT_MIME_TYPE;
    }

    async getContent(filename: string): Promise<Buffer>
    {
        const location = this.getAbsoluteLocation(filename);
        const exists = await this.#fileSystem.exists(location);

        if (exists === false)
        {
            // Do NOT use the location in the error message,
            // as it may contain sensitive information.
            throw new FileNotFound(filename);
        }

        return this.#fileSystem.read(location);
    }

    async exists(filename: string): Promise<boolean>
    {
        const location = this.getAbsoluteLocation(filename);

        return this.#fileSystem.exists(location);
    }

    isDirectory(filename: string): boolean
    {
        const location = this.getAbsoluteLocation(filename);

        return this.#fileSystem.isDirectory(location);
    }

    async read(filename: string): Promise<File>
    {
        const absoluteFilename = this.getAbsoluteLocation(filename);

        const type = await this.getType(absoluteFilename);
        const content = await this.getContent(absoluteFilename);

        return new File(filename, type, content);
    }

    async write(filename: string, content: string): Promise<void>
    {
        const location = this.getAbsoluteLocation(filename);
        
        return this.#fileSystem.write(location, content);
    }

    async copy(source: string, destination: string): Promise<void>
    {
        const sourceLocation = this.getAbsoluteLocation(source);
        const destinationLocation = this.getAbsoluteLocation(destination);

        return this.#fileSystem.copy(sourceLocation, destinationLocation);
    }

    async delete(filename: string): Promise<void>
    {
        const location = this.getAbsoluteLocation(filename);

        return this.#fileSystem.delete(location);
    }

    async filter(pattern: string): Promise<string[]>
    {
        const location = this.getAbsoluteLocation('./');
        
        const normalizedPattern = this.#fileSystem.normalize(pattern);

        const filenames = await this.#fileSystem.filter(location, normalizedPattern);

        return filenames.map(filename => this.#fileSystem.normalize(filename));
    }

    #validateLocation(location: string, filename: string): void
    {
        if (location.startsWith(this.#rootLocation) === false)
        {
            // The filename is only needed for the error message. This
            // ensures that the error message does not contain sensitive
            // information.
            throw new InvalidLocation(filename);
        }
    }
}
