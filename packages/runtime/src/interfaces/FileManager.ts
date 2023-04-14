
import File from '../models/File.js';

interface FileManager
{
    getRootLocation(): string;

    getAbsoluteLocation(filename: string): string;

    getRelativeLocation(filename: string): string;

    getType(filename: string): Promise<string>;

    getContent(filename: string): Promise<Buffer | string>;

    read(filename: string): Promise<File>;

    write(filename: string, content: string): Promise<void>;

    delete(filename: string): Promise<void>;

    filter(pattern: string): Promise<string[]>;
}

export default FileManager;
