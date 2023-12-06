import solidjslogo from './logo.svg'
import jitarLogo from './assets/jitar.svg'
import type { Component } from 'solid-js'
import { createResource } from 'solid-js'
import { sayHello } from './domain/sayHello'

const sayHelloResource = async () => {
  return await sayHello('Vite + Solid + Jitar')
}

const App: Component = () => {
  const [message] = createResource(sayHelloResource)

  return (
    <>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidjslogo} class="logo solid" alt="Solid logo" />
        </a>
        <a href="https://jitar.dev" target="_blank">
          <img src={jitarLogo} class="logo jitar" alt="Jitar logo" />
        </a>
        <h1>{ message }</h1>
    </>
  );
};

export default App