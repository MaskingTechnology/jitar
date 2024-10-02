
class Parent
{
    id: number;

    constructor(id: number)
    {
        this.id = id;
    }

    speak(): string
    {
        return 'Hello';
    }
}

class Child extends Parent
{
    #firstName: string; // No getter and setter
    #lastName: string; // No getter and setter
    #age: number; // No setter
    #state: string; // No getter

    constructor(id: number, firstName: string, lastName: string, age: number)
    {
        super(id);

        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#age = age;
        this.#state = 'Ottawa';
    }

    get fullName() { return `${this.#firstName} ${this.#lastName}`; }

    get age() { return this.#age; }

    set state(state: string) { this.#state = state; }

    toString(): string
    {
        return `${this.fullName} is ${this.#age} years old and lives in ${this.#state}`;
    }
}

// Custom class with function declaration parent
class CustomError extends Error
{
    #additional: string;

    constructor(message: string, additional: string)
    {
        super(message);

        this.#additional = additional;
    }

    get additional() { return this.#additional; }
}

export const CLASSES = { Parent, Child, CustomError };
