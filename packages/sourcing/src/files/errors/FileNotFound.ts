
export default class FileNotFound extends Error
{
    constructor(filename: string)
    {
        super(`File could not be found from '${filename}'`);
    }
}
