---
layout: doc

prev:
    text: Data sharing
    link: /develop/data-sharing

next:
    text: State management
    link: /develop/state-management

---

# Error handling

For handling errors the default JavaScript error system can be used for throwing and catching errors. When an error occurs it will be passed to the calling procedure until it’s catched like any normal JavaScript application. If the error occurs on a remote server, the error will be (de)serialized and rethrown on the calling node.

You can create your own custom errors and use the `instanceof` operator to distinguish them like this:

```ts
// src/DatabaseError.ts
export DatabaseError extends Error
{
    constructor()
    {
        super('Database error');
    }
}
```

```ts
// src/domain/account/storeAccount.ts
import { Account } from './Account';
import { DatabaseError } from '../DatabaseError';

export async function storeAccount(account: Account): Promise<void>
{
    throw new Error('Not implemented');
}
```

```ts
// src/domain/account/createAccount.ts
import { Account } from './Account';
import { storeAccount } from './storeAccount';
import { DatabaseError } from '../DatabaseError';

export async function createAccount(name: string, email: string): Promise<Account>
{
    try
    {
        const account = new Account(name, email); 

        await storeAccount(account);

        return account;
    }
    catch (error: unknown)
    {
        if (error instanceof DatabaseError)
        {
            // handle the database error
        }
        else
        {
            // handle other error
        }
    }
}
```
