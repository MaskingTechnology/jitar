
import File from '../models/File.js';

export default interface FileManager
{
    getRootLocation(): string;

    getAbsoluteLocation(filename: string): string;

    getRelativeLocation(filename: string): string;

    getType(filename: string): Promise<string>;

    getContent(filename: string): Promise<Buffer | string>;

    load(filename: string): Promise<File>;

    store(filename: string, content: string): Promise<void>;
}
