<script setup>
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
</script>

<template>
  <div class="app">
    <Header />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  main {
    padding: 2rem;
  }
}
</style>
