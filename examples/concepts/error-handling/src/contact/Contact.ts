
export default class Contact
{
    #name: string;
    #email: string;

    constructor(name: string, email: string)
    {
        this.#name = name;
        this.#email = email;
    }

    get name() { return this.#name; };

    get email() { return this.#email; };
}