
import Header from './common/views/Header.js';
import ContactPage from './contact/views/ContactPage.js';

export function App(props: any)
{
    return (
        <main className='container'>
            <Header />
            <ContactPage />
        </main>
      );
}
