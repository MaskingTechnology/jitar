<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <Suspense>
    
    <HelloWorld/>

    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>