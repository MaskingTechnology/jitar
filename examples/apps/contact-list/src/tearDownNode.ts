
import Database from './integrations/database/Database';

await Database.disconnect();

console.log('Disconnected from database');
