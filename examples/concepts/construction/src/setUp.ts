
import database from './database';

database.set('foo', 'bar');
database.set('bar', 'baz');
database.set('baz', 'foo');

console.log('Database initialized', database.size);
