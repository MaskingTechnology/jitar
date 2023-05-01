
// This is the browser client entry point. It uses the `startClient` function
// to start a Jitar client. Note that the differences between this starter and
// the Node.js starter.

// @ts-ignore
import { startClient } from '/jitar/client.js';

const client = await startClient(document.location.origin, ['client']);

const { default: sayBoth } = await client.import('./greetings/sayBoth') as any;

const message = await sayBoth('John', 'Doe');

alert(message);
