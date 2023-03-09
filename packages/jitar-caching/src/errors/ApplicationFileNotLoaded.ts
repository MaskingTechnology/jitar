
export default class ApplicationFileNotLoaded extends Error
{
    constructor(filename: string)
    {
        super(`Failed to load application file '${filename}'`);
    }
}
