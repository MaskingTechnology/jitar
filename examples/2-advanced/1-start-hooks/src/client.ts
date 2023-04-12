
import { startClient } from 'jitar';

const client = await startClient('client');

// We need to import the sayHello component with the Jitar client.
// This enables the segmentation of the application.
const { default: sayBoth } = await client.import('./greetings/sayBoth.js') as any;

const message = await sayBoth('John', 'Doe');

alert(message);
