
import ContactForm from './ContactForm';
import ContactList from './ContactList';

import Contact from '../models/Contact';

import getContacts from '../actions/getContacts';
import createContact from '../actions/createContact';
import updateContact from '../actions/updateContact';
import deleteContact from '../actions/deleteContact';

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
