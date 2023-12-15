
import { startClient } from 'jitar';

const client = await startClient('http://127.0.0.1:3000', ['client']);

const { default: getLuckyNumber } = await client.import('./getLuckyNumber', 'application') as any;

const number = await getLuckyNumber(0, 100);

console.log(`Your lucky number is ${number}!`);
