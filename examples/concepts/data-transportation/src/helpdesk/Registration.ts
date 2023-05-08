
import Account from '../account/Account';

export default class Registration
{
    #account: Account;
    #created: Date;

    constructor(account: Account)
    {
        this.#account = account;
        this.#created = new Date();
    }

    get account() { return this.#account; }

    get created() { return this.#created; }

    toString(): string
    {
        return `Registration for ${this.#account} created on ${this.#created}`;
    }
}
