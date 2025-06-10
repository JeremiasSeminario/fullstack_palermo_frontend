<script setup>
import { useCartStore } from '../../stores/cart'
import { useProductsStore } from '../../stores/products'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const productsStore = useProductsStore()

const reservationDetails = cartStore.reservationDetails[props.item.id]
const hasReservation = !!reservationDetails

function removeItem() {
  cartStore.removeFromCart(props.item.id)
}

function formatTimeRange(slots) {
  if (!slots || slots.length === 0) return 'No horario seleccionado'
  
  const start = slots[0]
  const end = getEndTime(slots[slots.length - 1])
  return `${start} - ${end}`
}

function getEndTime(timeSlot) {
  const [hours, minutes] = timeSlot.split(':').map(Number)
  let newMinutes = minutes + 30
  let newHours = hours
  
  if (newMinutes >= 60) {
    newMinutes = 0
    newHours += 1
  }
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="cart-item">
    <div class="item-info">
      <div class="item-image">
        <img :src="product.image" :alt="product.name">
      </div>
      
      <div class="item-details">
        <h4>{{ product.name }}</h4>
        
        <div v-if="item.accessories && item.accessories.length > 0" class="item-accessories">
          <p><small>Incluye: {{ item.accessories.map(a => a.name).join(', ') }}</small></p>
        </div>
        
        <p><small>Personas: {{ item.persons }}</small></p>
        
        <div v-if="hasReservation" class="reservation-info">
          <p><small>Fecha: {{ reservationDetails.date }}</small></p>
          <p><small>Horario: {{ formatTimeRange(reservationDetails.slots) }}</small></p>
        </div>
      </div>
    </div>
    
    <div class="item-actions">
      <button @click="removeItem" class="delete-button" title="Eliminar">
        <span class="trash-icon">🗑️</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-gray-light);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  gap: var(--space-md);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h4 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-primary-dark);
}

.item-accessories {
  margin-bottom: var(--space-xs);
}

.item-accessories p, 
.reservation-info p {
  margin: 0;
  color: var(--color-gray);
}

.reservation-info {
  margin-top: var(--space-xs);
}

.delete-button {
  background-color: transparent;
  color: var(--color-error);
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  background-color: rgba(217, 4, 41, 0.1);
}

.trash-icon {
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .item-info {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 120px;
  }
}
</style>