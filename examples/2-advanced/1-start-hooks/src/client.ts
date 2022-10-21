
// @ts-ignore (the import will be valid at runtime)
import { startClient } from '/jitar/client.js';

const client = await startClient('client');

// We need to import the sayHello component with the Jitar client.
// This enables the segmentation of the application.
const { default: sayBoth } = await client.import('./greetings/sayBoth.js');

const message = await sayBoth('John', 'Doe');

alert(message);
