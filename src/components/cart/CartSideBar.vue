<script setup>
import { computed } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'
import CartItem from './CartItem.vue'

const productsStore = useProductsStore()
const cartStore = useCartStore()

const cartItems = computed(() => cartStore.cartItems)
const hasItems = computed(() => cartItems.value.length > 0)
const subtotal = computed(() => cartStore.subtotal)
const hasDiscount = computed(() => cartStore.hasDiscount)
const discount = computed(() => cartStore.discount)
const total = computed(() => cartStore.total)

function getProductById(id) {
  return productsStore.getProductById(id)
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
}

function getItemPrice(item) {
  const product = getProductById(item.productId)
  if (!product) return 0
  
  const details = cartStore.reservationDetails[item.id]
  const slots = details ? details.slots.length : 0
  
  return product.price * slots
}
</script>

<template>
  <div class="cart-sidebar">
    <div class="cart-header">
      <h3>Productos Seleccionados ({{ cartItems.length }})</h3>
    </div>
    
    <div v-if="hasItems" class="cart-content">
      <div class="cart-items">
        <CartItem 
          v-for="item in cartItems" 
          :key="item.id" 
          :item="item" 
          :product="getProductById(item.productId)" 
        />
      </div>
      
      <div class="cart-summary">
        <div class="price-breakdown">
          <h4>Resumen</h4>
          <div v-for="item in cartItems" :key="item.id" class="item-breakdown">
            <div class="item-name">{{ getProductById(item.productId)?.name }}</div>
            <div class="item-calculation">
              ${{ getProductById(item.productId)?.price }} × {{ cartStore.reservationDetails[item.id]?.slots?.length || 0 }} turnos = {{ formatCurrency(getItemPrice(item)) }}
            </div>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          
          <div v-if="hasDiscount" class="summary-row discount">
            <span>Descuento (10%):</span>
            <span>-{{ formatCurrency(discount) }}</span>
          </div>
          
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>
        </div>
        
        <div class="cart-actions">
          <router-link to="/checkout" class="checkout-link">
            <button>Continuar con la reserva</button>
          </router-link>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-cart">
      <p>No has seleccionado ningún producto</p>
    </div>
  </div>
</template>

<style scoped>
.cart-sidebar {
  background-color: var(--color-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.cart-header {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-md);
}

.cart-header h3 {
  margin: 0;
}

.cart-content {
  padding: var(--space-md);
}

.cart-items {
  margin-bottom: var(--space-lg);
}

.cart-summary {
  border-top: 1px solid var(--color-gray-light);
  padding-top: var(--space-md);
}

.price-breakdown {
  margin-bottom: var(--space-lg);
}

.price-breakdown h4 {
  margin-bottom: var(--space-sm);
  color: var(--color-primary-dark);
  font-size: var(--font-size-md);
}

.item-breakdown {
  margin-bottom: var(--space-sm);
  padding: var(--space-xs);
  background-color: var(--color-white);
  border-radius: var(--radius-sm);
}

.item-name {
  font-weight: 500;
  color: var(--color-primary-dark);
  font-size: var(--font-size-sm);
}

.item-calculation {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.summary-totals {
  border-top: 1px solid var(--color-gray-light);
  padding-top: var(--space-sm);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.discount {
  font-weight: bold;
  color: var(--color-success);
}

.total {
  font-weight: bold;
  font-size: var(--font-size-lg);
  margin-top: var(--space-md);
  margin-bottom: var(--space-md);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.add-more-link {
  width: 100%;
}

.add-more-link button {
  width: 100%;
}

.empty-cart {
  padding: var(--space-xl);
  text-align: center;
}

.empty-cart p {
  margin: 0;
  color: var(--color-gray);
}

@media (max-width: 768px) {
  .cart-actions {
    flex-direction: column;
  }
}
</style>