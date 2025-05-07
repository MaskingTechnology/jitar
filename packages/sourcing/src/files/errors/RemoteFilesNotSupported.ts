
export default class RemoteFilesNotSupported extends Error
{
    constructor()
    {
        super('Remote files are not supported');
    }
}
