<script setup lang="ts">

import { ref } from 'vue';
import { sayHello } from '../domain/sayHello';

const message = ref('');

async function runComponent() {
  message.value = await sayHello('Vite + Vue + Jitar');
}

runComponent()

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="https://jitar.dev" target="_blank" rel="noopener noreferrer">
      <img src="./assets/jitar.svg" class="logo jitar" alt="Jitar logo" />
    </a>
  </div>
  <h1>{{ message }}</h1>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.logo.jitar:hover {
  filter: drop-shadow(0 0 2em #6e9ae1);
}
</style>