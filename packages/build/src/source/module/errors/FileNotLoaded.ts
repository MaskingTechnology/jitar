
export default class FileNotLoaded extends Error
{
    constructor(filename: string, message: string)
    {
        super(`Failed to load module file '${filename}' because of: ${message}`);
    }
}
