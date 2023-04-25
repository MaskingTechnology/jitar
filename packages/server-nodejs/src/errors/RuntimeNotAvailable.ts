
export default class RuntimeNotAvailable extends Error
{
    constructor()
    {
        super('Runtime is not available');
    }
}
