
class Human
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

class Person extends Human
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

const johnDoe = new Person(1, 'John', 'Doe', 42);
const janeDoe = { id: 2, fullName: 'Jane Doe', age: 42 };
const plainError = new Error('Plain error');
const customError = new CustomError('Custom error', 'with extras');

function requiredFunction(a: string, b: Person, c: number): string
{
    return a + b + c;
}

function optionalFunction(a: string, b = new Person(1, 'Jane', 'Doe', 42), c = 0): string
{
    return a + b + c;
}

const testModule = { Person, johnDoe, requiredFunction };

export
{
    Person, CustomError,
    johnDoe, janeDoe, plainError, customError,
    optionalFunction,
    testModule
};
