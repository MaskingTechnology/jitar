
export default class DuplicateImplementation extends Error
{
    constructor(fqn: string, version: string)
    {
        super(`Duplicate implementation found for '${fqn}' with version '${version}'.`);
    }
}
