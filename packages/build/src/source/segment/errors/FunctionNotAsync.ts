
export default class FunctionNotAsync extends Error
{
    constructor(filename: string, functionName: string)
    {
        super(`Function '${functionName}' from file '${filename}' is not async`);
    }
}
