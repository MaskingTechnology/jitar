
import ContactForm from './ContactForm.js';
import ContactList from './ContactList.js';

import Contact from '../models/Contact.js';

import getContacts from '../actions/getContacts.js';
import createContact from '../actions/createContact.js';
import updateContact from '../actions/updateContact.js';
import deleteContact from '../actions/deleteContact.js';

export default function ContactPage(props: any)
{
    const [contacts, setContacts] = React.useState<Contact[]>([]);

    const initContacts = () =>
    {
        getContacts().then(contacts => setContacts(contacts));
    }

    const storeContact = (id: string, name: string, address: string, phone: string, email: string): void =>
    {
        const action = id.length === 0
            ? createContact(name, address, phone, email)
            : updateContact(id, name, address, phone, email);
        
        action.then(() => initContacts());
    }

    const removeContact = (contact: Contact) =>
    {
        deleteContact(contact).then(() => initContacts());
    }

    React.useEffect(initContacts, []);
    
    return (
        <div className='row gx-4'>
            <section className='col-4'>
                <ContactForm submitAction={storeContact} />
            </section>
            <section className='col'>
                <ContactList contacts={contacts} removeAction={removeContact} />
            </section>
        </div>
    );
}
