
export default class FileNotLoaded extends Error
{
    constructor(filename: string, message: string)
    {
        super(`Failed to load segment file '${filename}' because of: ${message}`);
    }
}
