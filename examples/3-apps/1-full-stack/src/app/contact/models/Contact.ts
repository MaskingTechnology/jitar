
export default class Contact
{
    #id: string;
    #name: string;
    #address: string;
    #phone: string;
    #email: string;

    constructor(id: string, name: string, address: string, phone: string, email: string)
    {
        this.#id = id;
        this.#name = name;
        this.#address = address;
        this.#phone = phone;
        this.#email = email;
    }

    get id() { return this.#id; }

    get name() { return this.#name; }

    get address() { return this.#address; }

    get phone() { return this.#phone; }

    get email() { return this.#email; }
}
