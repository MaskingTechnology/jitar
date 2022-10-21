
// @ts-ignore (the import will be valid at runtime)
import { startClient } from '/jitar/client.js';

const client = await startClient();

// We need to import the App component with the Jitar client.
// This enables the segmentation of the application.
const { App } = await client.import('./app/App.js');

const rootElement = document.getElementById('root') as HTMLElement;

// @ts-ignore (avoids the need for importing ReactDOM)
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
