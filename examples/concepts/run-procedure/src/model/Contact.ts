
// The different versions of the Contact model. Note that it has a version property with a fixed value.
// In real-world applications, the version number could be determined from anywhere, e.g. a database. The version number
// is set here for demonstration purposes.

export class Contact
{
    #name: string;
    #email: string;
    #version: string;

    constructor(name: string, email: string)
    {
        this.#name = name;
        this.#email = email;

        this.#version = '0.0.0';
    }

    get name() { return this.#name; };

    get email() { return this.#email; };

    get version() { return this.#version; };
}

export class ContactV2
{
    #firstName: string;
    #lastName: string;
    #emails: string[];
    #version: string;

    constructor(firstName: string, lastName: string, emails: string[])
    {
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#emails = emails;

        this.#version = '1.0.0';
    }

    get firstName() { return this.#firstName; };

    get lastName() { return this.#lastName; };

    get emails() { return this.#emails; };

    get version() { return this.#version; };
}
