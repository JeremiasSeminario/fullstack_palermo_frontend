<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cart'

const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)
</script>

<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <h1>Parador Punta Hermosa</h1>
      </router-link>
      
      <nav class="nav">
        <router-link to="/">Productos</router-link>
        <router-link to="/checkout" class="cart-link" v-if="itemCount > 0">
          <span>Mi Carrito</span>
          <span class="cart-badge">{{ itemCount }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-md) var(--space-lg);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  color: var(--color-white);
  font-weight: bold;
  text-decoration: none;
}

.logo h1 {
  font-size: var(--font-size-xl);
  margin: 0;
}

.nav {
  display: flex;
  gap: var(--space-lg);
}

.nav a {
  color: var(--color-white);
  
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav a:hover {
  opacity: 0.8;
}

.cart-link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.cart-badge {
  background-color: var(--color-accent);
  color: var(--color-dark);
  border-radius: var(--radius-full);
  padding: 0.1rem 0.5rem;
  font-size: var(--font-size-sm);
  font-weight: bold;
}

@media (max-width: 576px) {
  .logo h1 {
    font-size: var(--font-size-lg);
  }
  
  .nav {
    gap: var(--space-md);
  }
}
</style>