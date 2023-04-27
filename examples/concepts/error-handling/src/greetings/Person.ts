
/*
 * Any class object can be transported between segments as
 * long as they can be reconstructed.
 * 
 * Private fields are supported as long as they are initialized
 * in the constructor or can be set using a setter. Otherwise,
 * their value will get lost in the transportation process.
 * 
 * If a class is transported between segments, it doesn't have
 * to be added to a segment file. All unsegmented components
 * are considered as sharable.
 */

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

    get fullName() { return `${this.#firstName} ${this.#lastName}`; }
}
