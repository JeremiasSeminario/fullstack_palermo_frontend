<script setup>
import { onMounted, computed } from 'vue'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/products/ProductCard.vue'
import CartSidebar from '../components/cart/CartSideBar.vue'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const products = computed(() => productsStore.products)

// Cargar productos al montar el componente
onMounted(async () => {
  await productsStore.loadProducts()
})
</script>

<template>
  <div class="product-list-view">
    <div class="page-header">
      <h2>Productos Disponibles</h2>
      <p>Selecciona los productos que deseas alquilar</p>
    </div>
    
    <div class="products-container">
      <div class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
      
      <div class="cart-container">
        <CartSidebar />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list-view {
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.page-header h2 {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-xxl);
}

.page-header p {
  color: var(--color-gray);
  max-width: 600px;
  margin: 0 auto;
}

.products-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-lg);
}

@media (min-width: 576px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .products-container {
    grid-template-columns: 2fr 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.cart-container {
  position: sticky;
  top: var(--space-lg);
}
</style>