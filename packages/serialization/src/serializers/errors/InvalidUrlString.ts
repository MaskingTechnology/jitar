
export default class InvalidUrlString extends Error
{
    constructor(urlString: string)
    {
        super(`Invalid url string: '${urlString}'`);
    }
}
