
import Contact from '../../shared/contact/Contact';

type ContactItemProps =
{
    contact: Contact;
    removeAction: () => void;
};

export default function ContactItem(props: ContactItemProps)
{
    const contact = props.contact;
    const removeAction = props.removeAction;

    return (
        <div className='card mb-3'>
            <h4 className='card-header d-flex justify-content-between align-items-center'>
                <span>{contact.name}</span>
                <span onClick={removeAction}>
                    <i className='bi bi-trash text-danger' style={{ fontSize: '1rem' }}></i>
                </span>
            </h4>
            <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                    <i className='bi bi-house'></i> {contact.address}
                </li>
                <li className='list-group-item'>
                <i className='bi bi-telephone'></i> <a href='#'>{contact.phone}</a>
                </li>
                <li className='list-group-item'>
                <i className='bi bi-mailbox'></i> <a href='#'>{contact.email}</a>
                </li>
            </ul>
        </div>
      );
}
