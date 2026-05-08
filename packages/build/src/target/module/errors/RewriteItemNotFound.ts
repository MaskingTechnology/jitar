
export default class RewriteItemFound extends Error
{
    constructor(definition: string)
    {
        super(`Could not find the rewrite item: ${definition}`);
    }
}
