
export default class Person
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

    get fullName() { return `${this.#lastName} ${this.#firstName}`; }
}
