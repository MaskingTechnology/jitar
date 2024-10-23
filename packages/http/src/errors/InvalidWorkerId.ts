
export default class InvalidWorkerId extends Error
{
    constructor()
    {
        super('Invalid worker id');
    }
}
