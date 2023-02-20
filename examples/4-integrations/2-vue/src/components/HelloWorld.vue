<script lang="ts">
import { sayHello } from '../shared/sayHello';

export default 
{
  async setup() 
  {
    const message = await sayHello('Vite + Vue + Jitar');

    return { message }
  }
}
</script>

<template>
    <h1>{{ message }}</h1>
</template>