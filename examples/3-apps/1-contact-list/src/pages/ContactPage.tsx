
import { useEffect, useState } from 'react';

import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';

import Contact from '../shared/contact/Contact';
import getContacts from '../shared/contact/getContacts';
import createContact from '../shared/contact/createContact';
import deleteContact from '../shared/contact/deleteContact';

export default function ContactPage()
{
    const [contacts, setContacts] = useState<Contact[]>([]);

    const loadContacts = () =>
    {
        getContacts().then(contacts => setContacts(contacts));
    }

    const storeContact = (name: string, address: string, phone: string, email: string): void =>
    {
        createContact(name, address, phone, email).then(() => loadContacts());
    }

    const removeContact = (contact: Contact) =>
    {
        deleteContact(contact).then(() => loadContacts());
    }

    useEffect(loadContacts, []);
    
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
