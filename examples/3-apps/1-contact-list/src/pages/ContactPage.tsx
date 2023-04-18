
import { useEffect, useState } from 'react';

import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';

import Contact from '../shared/contact/Contact';
import getContacts from '../shared/contact/getContacts';
import createContact from '../shared/contact/createContact';
import updateContact from '../shared/contact/updateContact';
import deleteContact from '../shared/contact/deleteContact';

export default function ContactPage()
{
    const [contacts, setContacts] = useState<Contact[]>([]);

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

    useEffect(initContacts, []);
    
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
