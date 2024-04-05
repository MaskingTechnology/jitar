
import Database from '../database/Database';

await Database.disconnect();

console.log('Disconnected from database');
