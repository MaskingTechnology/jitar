
import Database from './integrations/database/Database';

await Database.connect('mongodb://root:example@localhost:27017', 'react-mongodb');
