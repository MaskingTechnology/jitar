
export default class IdGenerator
{
    #id = 0;

    next(): string
    {
        return `$${++this.#id}`;
    }
}
