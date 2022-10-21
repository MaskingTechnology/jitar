
import Contact from './Contact.js';

export default function ContactList(props: any)
{
    const contacts = props.contacts;
    const removeAction = props.removeAction;

    return contacts.length > 0
        ? contacts.map((contact: any) => <Contact key={contact.id} contact={contact} removeAction={() => removeAction(contact)} />)
        : <div className='alert alert-light'>No contacts yet</div>;
}
