
export default class RuntimeNotAvaiable extends Error
{
    constructor()
    {
        super('Runtime is not available');
    }
}
