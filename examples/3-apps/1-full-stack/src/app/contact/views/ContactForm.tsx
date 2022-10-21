
export default function ContactForm(props: any)
{
    const submitAction = props.submitAction;
    const contact = props.contact;

    const handleSubmit = (event: any): void =>
    {
        event.preventDefault();

        const form = event.target;
        
        submitAction('', form.name.value, form.address.value, form.phone.value, form.email.value);

        form.reset();
    }

    return (
        <form onSubmit={handleSubmit} className='p-3 border bg-light'>
            <input type="hidden" name="id" value={contact?.id} />
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Full name</label>
                <input type="text" className="form-control" name="name" id="name" />
            </div>
            <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" name="address" id="address" />
            </div>
            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone number</label>
                <input type="phone" className="form-control" name="phone" id="phone" />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name="email" id="email" />
            </div>
            <input type="submit" name="Add contact" className="btn btn-primary" />
        </form>
    );
}
