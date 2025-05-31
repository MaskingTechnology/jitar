
import { useEffect, useState } from 'react';

import './App.css';
import reactLogo from './assets/react.svg';
import jitarLogo from './assets/jitar.svg';

import { sayHello } from '../domain/sayHello';

export default function App()
{
  const [message, setMessage] = useState<string>('Loading...');

  const getMessage = () =>
  {
    sayHello('Vite + React + Jitar').then(message => setMessage(message));
  }

  useEffect(getMessage, []);

  return (
    <div className="App">
      <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://jitar.dev" target="_blank" rel="noopener noreferrer">
          <img src={jitarLogo} className="logo jitar" alt="Jitar logo" />
        </a>
      <h1>{message}</h1>
    </div>
  )
}
