
export default class NotAFunction extends Error
{
    constructor(filename: string, exportKey: string)
    {
        super(`The export '${exportKey}' from file '${filename}' is not a function`);
    }
}
