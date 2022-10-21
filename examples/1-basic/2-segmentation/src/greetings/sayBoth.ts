
/*
 * Procedures can be imported using the ES module syntax.
 *
 * If a procedure runs on another node, it will be replaced with a
 * remote procedure call.
 */

import sayHi from './sayHi.js';
import sayHello from './sayHello.js';

export default async function sayBoth(firstName: string, lastName: string): Promise<string>
{
    // This procedure will always be called locally because its
    // in the same segment.
    const hiMessage = await sayHi(firstName);

    // This procedure will be called remotely in production mode
    // because its placed in antoher segment.
    const helloMessage = await sayHello(firstName, lastName);

    return `${hiMessage}\n${helloMessage}`;
}
