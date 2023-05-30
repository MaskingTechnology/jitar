
import Contact from '../../shared/contact/Contact';

import ContactItem from './ContactItem';

type ContactListProps =
{
    contacts: Contact[];
    removeAction: (contact: Contact) => void;
};

export default function ContactList(props: ContactListProps)
{
    const contacts = props.contacts;
    const removeAction = props.removeAction;

    return contacts.length > 0
        ? <>{ contacts.map((contact: Contact) => <ContactItem key={contact.id} contact={contact} removeAction={() => removeAction(contact)} />) }</>
        : <div className='alert alert-light'>No contacts yet</div>;
}
