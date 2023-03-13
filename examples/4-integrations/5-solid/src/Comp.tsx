
import './Comp.css';
import { createResource } from 'solid-js';
import { sayHello } from './shared/sayHello';

const sayHelloResource = async () => {
    return await sayHello('Vite + Solid + Jitar');
}

export default () => {
    const [message] = createResource(sayHelloResource);
    
    return(<>
        <div class="logos">
            <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
            </a>
            <a href="https://solidjs.com" target="_blank">
            <img src="/solid.svg" class="logo solid" alt="Solid logo" />
            </a>
        </div>
        <h1>{ message }</h1>
    </>);
};
