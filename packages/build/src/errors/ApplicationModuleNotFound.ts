
export default class ApplicationModuleNotFound extends Error
{
    constructor(filename: string)
    {
        super(`Application module not found '${filename}'`);
    }
}
