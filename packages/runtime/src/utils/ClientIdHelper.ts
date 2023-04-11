
const CLIENT_ID_PREFIX = 'CLIENT_';
const CLIENT_ID_REGEX = /^CLIENT_\d+$/;

let lastClientId = 0;

export default class ClientIdHelper
{
    generate(): string
    {
        return `${CLIENT_ID_PREFIX}${lastClientId++}`;
    }

    validate(clientId: string): boolean
    {
        return CLIENT_ID_REGEX.test(clientId);
    }
}
