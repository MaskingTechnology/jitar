<script lang="ts">
  
  import svelteLogo from './assets/svelte.svg'
  import jitarLogo from './assets/jitar.svg'
  import { sayHello } from '../domain/sayHello'

  async function runComponent()
  {
      return await sayHello('Vite + Svelte + Jitar')
  }

  const promise = runComponent()

</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
    <a href="https://jitar.dev" target="_blank" rel="noreferrer"> 
      <img src={jitarLogo} class="logo jitar" alt="Jitar Logo" />
    </a>
  </div>

  {#await promise then message}
	  <h1>{ message }</h1>
  {/await}
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .logo.jitar:hover {
    filter: drop-shadow(0 0 2em #6e9ae1);
  }
</style>
