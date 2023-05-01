
// This is a Node.js client that uses the `startClient` function to start a
// Jitar client. Note that the differences between this starter and
// the browser starter.

import { startClient } from 'jitar';

const client = await startClient('http://127.0.0.1:3000', ['client']);

const { default: sayBoth } = await client.import('greetings/sayBoth') as any;

const message = await sayBoth('John', 'Doe');

console.log(message);
