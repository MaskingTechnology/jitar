
interface FileSystem
{
    copy(source: string, destination: string): Promise<void>;

    delete(location: string): Promise<void>;
    
    exists(location: string): Promise<boolean>;

    filter(location: string, pattern: string): Promise<string[]>;

    isDirectory(location: string): boolean;

    join(...paths: string[]): string;

    read(location: string): Promise<Buffer>;

    resolve(location: string): string;

    relative(from: string, to: string): string;

    mimeType(location: string): Promise<string | undefined>;

    write(location: string, content: string): Promise<void>;
}

export default FileSystem;
