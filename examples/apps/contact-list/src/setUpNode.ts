
import Database from './integrations/database/Database';

Database.connect('mongodb://root:example@localhost:27017', 'react-mongodb');

console.log('Connected to database');
