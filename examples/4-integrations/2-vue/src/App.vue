<script setup lang="ts">
import { ref } from 'vue';
import { sayHello } from './shared/sayHello';

const message = ref('');

async function runComponent() {
  message.value = await sayHello('Vue + Vite + Jitar');
}

runComponent()
</script>

<template>
  <h1>{{ message }}</h1>
</template>