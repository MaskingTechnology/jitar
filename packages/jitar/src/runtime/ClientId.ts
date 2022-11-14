
const CLIENT_ID_PREFIX = 'CLIENT_';
const CLIENT_ID_REGEX = /^CLIENT_\d+$/;

let lastClientId = 0;

export default class ClientId
{
    static generate(): string
    {
        return `${CLIENT_ID_PREFIX}${lastClientId++}`;
    }

    static validate(clientId: string): boolean
    {
        return CLIENT_ID_REGEX.test(clientId);
    }
}
