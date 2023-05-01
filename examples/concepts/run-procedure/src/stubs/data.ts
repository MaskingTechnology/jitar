
import { Contact, ContactV2 } from '../model/Contact.js';

const contacts = [
    new Contact('John Doe', 'john.doe@acme.com'),
    new Contact('Jane Doe', 'jane.doe@acme.com'),
    new ContactV2('Mary', 'Doe', ['mary.doe@acme.com', 'mary@doe.com']),
    new ContactV2('Catherine', 'Doe', ['catherine.doe@acme.com'])
];

export { contacts };
