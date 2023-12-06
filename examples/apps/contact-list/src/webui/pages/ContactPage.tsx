
import { useEffect, useState } from 'react';

import ContactForm from '../components/contact/ContactForm';
import ContactList from '../components/contact/ContactList';

import Contact from '../../domain/contact/Contact';
import getContacts from '../../domain/contact/getContacts';
import createContact from '../../domain/contact/createContact';
import deleteContact from '../../domain/contact/deleteContact';

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
