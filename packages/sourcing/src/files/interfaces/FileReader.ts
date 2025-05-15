
import type File from '../models/File';

interface FileReader
{
    filter(...patterns: string[]): Promise<string[]>;
    
    exists(filename: string): Promise<boolean>;

    read(filename: string): Promise<File>;
}

export default FileReader;
