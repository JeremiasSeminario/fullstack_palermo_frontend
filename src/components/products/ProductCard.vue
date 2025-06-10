<script setup>
import { useCartStore } from '../../stores/cart'
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const cartStore = useCartStore()
const isInCart = computed(() =>
  cartStore.cartItems.some(item => item.productId === props.product.id)
)
</script>

<template>
  <div class="product-card card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    
    <div class="product-content">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      
      <div class="required-accessories" v-if="product.requiredAccessories.length > 0">
        <p class="accessories-note">
          <strong>Incluye:</strong> 
          {{ product.requiredAccessories.map(a => a.name).join(', ') }} (obligatorio)
        </p>
      </div>

      <p class="product-price">${{ product.price }} / 30 min</p>

      <router-link :to="`/product/${product.id}`" class="rent-button">
        <button :disabled="isInCart">
          {{ isInCart ? 'Ya en carrito' : 'Alquilar' }}
        </button>
      </router-link>
      
    </div>
  </div>
</template>

<style scoped>
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-xs);
  color: var(--color-primary-dark);
}

.product-description {
  margin-bottom: var(--space-md);
  flex-grow: 1;
  color: var(--color-primary-dark)
}

.product-price {
  font-weight: bold;
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.required-accessories {
  background-color: var(--color-secondary-dark);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.accessories-note {
  font-size: var(--font-size-sm);
}

.rent-button button {
  width: 100%;
}

.rent-button button:disabled,
.rent-button button:disabled:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
  cursor: not-allowed;
  filter: none;
  box-shadow: none;
  opacity: 0.6;
}
</style>