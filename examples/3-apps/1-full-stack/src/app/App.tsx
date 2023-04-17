
import Header from './common/views/Header';
import ContactPage from './contact/views/ContactPage';

export function App(props: any)
{
    return (
        <main className='container'>
            <Header />
            <ContactPage />
        </main>
      );
}
