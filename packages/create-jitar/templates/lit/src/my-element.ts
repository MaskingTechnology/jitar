
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import jitarLogo from './assets/jitar.svg'
import { sayHello } from './shared/sayHello';

@customElement('my-element')
export class MyElement extends LitElement
{
  @property({ type: String })
  message = '';

  constructor()
  {
    super();

    sayHello('Vite + Lit + Jitar').then((message: string) => this.message = message);
  }

  render()
  {
    return html`
      <div>
        <a href="https://vitejs.dev" target="_blank"><img src="/vite.svg" class="logo" alt="Vite logo" /></a>
        <a href="https://lit.dev" target="_blank"><img src=${litLogo} class="logo lit" alt="Lit logo" /></a>
        <a href="https://jitar.dev" target="_blank"><img src=${jitarLogo} class="logo jitar" alt="Jitar logo" /></a>
      </div>
      <div><h1>${this.message}</h1></div>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }
    .logo.jitar:hover {
      filter: drop-shadow(0 0 2em #6e9ae1);
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }
  `
}

declare global
{
  interface HTMLElementTagNameMap
  {
    'my-element': MyElement
  }
}
