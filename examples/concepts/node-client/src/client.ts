
import { startClient, Import } from 'jitar';

const client = await startClient('http://127.0.0.1:3000', ['client']);

const importModel = new Import('client', './getLuckyNumber', 'application');

const { default: getLuckyNumber } = await client.import(importModel) as any;

const number = await getLuckyNumber(0, 100);

console.log(`Your lucky number is ${number}!`);
