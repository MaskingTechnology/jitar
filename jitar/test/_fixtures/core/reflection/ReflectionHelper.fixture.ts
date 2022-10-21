
class Human {}

class Person extends Human
{
    id: number;
    #firstName: string; // No getter and setter
    #lastName: string; // No getter and setter
    #age: number; // No setter
    #state: string; // No getter

    constructor(id: number, firstName: string, lastName: string, age: number)
    {
        super();

        this.id = id;
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

class User extends Person {}

const johnDoe = new Person(1, 'John', 'Doe', 42);

function requiredArgedFunction(a: string, b: Person, c: number): string
{
    return a + b + c;
}

function optionalArgedFunction(a: string, b = new Person(1, 'Jane', 'Doe', 42), c = 0): string
{
    return a + b + c;
}

export
{
    Person,
    User,
    johnDoe,
    requiredArgedFunction,
    optionalArgedFunction
};
