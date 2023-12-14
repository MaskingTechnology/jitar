
import { startClient } from 'jitar';

const client = await startClient('http://127.0.0.1:3000', ['helpdesk']);

const { default: register } = await client.import('helpdesk/register', 'application') as any;

const registration = await register('John', 'Doe');

console.log(`Registration successful! Created on ${registration.created} for ${registration.account.toString()}!`);
