
export default class Account
{
    #firstName: string;
    #lastName: string;

    constructor(firstName: string, lastName: string)
    {
        this.#firstName = firstName;
        this.#lastName = lastName;
    }

    get firstName() { return this.#firstName; }

    get lastName() { return this.#lastName; }

    toString()
    {
        return `${this.#firstName} ${this.#lastName}`;
    }
}
