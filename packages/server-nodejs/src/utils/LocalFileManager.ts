
import fs from 'fs-extra';
import glob from 'glob-promise';
import mime from 'mime-types';
import path from 'path';

import { FileNotFound, FileManager, File } from '@jitar/runtime';

export default class LocalFileManager implements FileManager
{
    #location: string;

    constructor(location: string)
    {
        this.#location = location;
    }
    
    getRootLocation(): string
    {
        return path.resolve(this.#location);
    }

    getAbsoluteLocation(filename: string): string
    {
        const location = filename.startsWith('/') ? filename : path.join(this.#location, filename);

        return path.resolve(location);
    }

    getRelativeLocation(filename: string): string
    {
        return path.relative(this.#location, filename);
    }

    async getType(filename: string): Promise<string>
    {
        const location = this.getAbsoluteLocation(filename);

        return mime.lookup(location) || 'application/octet-stream';
    }

    async getContent(filename: string): Promise<Buffer>
    {
        const location = this.getAbsoluteLocation(filename);

        if (fs.existsSync(location) === false)
        {
            // Do NOT use the location in the error message,
            // as it may contain sensitive information.
            throw new FileNotFound(filename);
        }

        return fs.readFile(location);
    }

    async read(filename: string): Promise<File>
    {
        const type = await this.getType(filename);
        const content = await this.getContent(filename);

        return new File(filename, type, content);
    }

    async write(filename: string, content: string): Promise<void>
    {
        const location = this.getAbsoluteLocation(filename);
        const directory = path.dirname(location);

        await fs.mkdir(directory, { recursive: true });

        return fs.writeFile(location, content);
    }

    async copy(source: string, destination: string): Promise<void>
    {
        const sourceLocation = this.getAbsoluteLocation(source);
        const destinationLocation = this.getAbsoluteLocation(destination);

        return fs.copy(sourceLocation, destinationLocation, { overwrite: true });
    }

    async delete(filename: string): Promise<void>
    {
        const location = this.getAbsoluteLocation(filename);

        return fs.remove(location);
    }

    async filter(pattern: string): Promise<string[]>
    {
        const location = this.getAbsoluteLocation('./');

        return await glob(`${location}/${pattern}`);
    }

    async getNodeSegmentFiles(): Promise<string[]>
    {
        return this.filter('**/*.segment.node.js');
    }

    async getRepositorySegmentFiles(): Promise<string[]>
    {
        return this.filter('**/*.segment.repository.js');
    }

    async getAssetFiles(patterns: string[]): Promise<string[]>
    {
        const promises = patterns.map(pattern => this.filter(pattern));
        const assetFiles = (await Promise.all(promises)).flat();

        return assetFiles
            .map(filename => this.getRelativeLocation(filename))
            .filter(filename => this.#isGeneratedFile(filename) === false);
    }

    #isGeneratedFile(filename: string): boolean
    {
        return filename.endsWith('.local.js')
            || filename.endsWith('.node.js')
            || filename.endsWith('.repository.js')
            || filename.endsWith('.remote.js');
    }
}
