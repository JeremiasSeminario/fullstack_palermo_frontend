<script setup>
import { computed } from 'vue'
import { useProductsStore } from '../../stores/products'
import { useCartStore } from '../../stores/cart'
import { useCheckoutStore } from '../../stores/checkout'

const props = defineProps({
  cartItems: Array,
  reservationDetails: Object,
  paymentMethod: String,
  subtotal: Number,
  hasDiscount: Boolean,
  discount: Number,
  total: Number
})

const productsStore = useProductsStore()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

const cartItems = computed(() => props.cartItems || cartStore.cartItems)
const reservationDetails = computed(() => props.reservationDetails || cartStore.reservationDetails)
const paymentMethod = computed(() => props.paymentMethod || checkoutStore.paymentMethod)
const subtotal = computed(() => props.subtotal ?? cartStore.subtotal)
const hasDiscount = computed(() => props.hasDiscount ?? cartStore.hasDiscount)
const discount = computed(() => props.discount ?? cartStore.discount)
const total = computed(() => props.total ?? cartStore.total)

function getProductById(id) {
  return productsStore.getProductById(id)
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`
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

function getItemPrice(item) {
  const product = getProductById(item.productId)
  if (!product) return 0
  
  const details = reservationDetails.value[item.id]
  const slots = details ? details.slots.length : 0
  
  return product.price * slots
}
</script>

<template>
  <div class="reservation-summary">
    <h3>Resumen de la Reserva</h3>
    
    <div class="summary-section products-section">
      <h4>Productos Reservados</h4>
      
      <div class="product-item" v-for="item in cartItems" :key="item.id">
        <div class="product-details">
          <h5>{{ getProductById(item.productId)?.name }}</h5>
          
          <div v-if="item.accessories && item.accessories.length > 0" class="accessories-list">
            <p><small>Incluye: {{ item.accessories.map(a => a.name).join(', ') }}</small></p>
          </div>
          
          <p><small>Personas: {{ item.persons }}</small></p>
          
          <div class="reservation-details" v-if="reservationDetails[item.id]">
            <p><small>Fecha: {{ reservationDetails[item.id].date }}</small></p>
            <p><small>Horario: {{ formatTimeRange(reservationDetails[item.id].slots) }}</small></p>
            <p><small>Duración: {{ reservationDetails[item.id].slots.length * 30 }} minutos</small></p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="summary-section payment-section">
      <h4>Método de Pago</h4>
      <p>{{ paymentMethod === 'cash' ? 'Pago en efectivo en el parador' : 'Pago online' }}</p>
      
      <div class="payment-note" v-if="paymentMethod === 'cash'">
        <p class="note">Recuerda que debes realizar el pago al menos 2 horas antes del turno.</p>
      </div>
    </div>
    
    <div class="summary-section price-section">
      <h4>Resumen de Precios</h4>
      
      <div class="price-breakdown">
        <div v-for="item in cartItems" :key="item.id" class="item-breakdown">
          <div class="item-name">{{ getProductById(item.productId)?.name }}</div>
          <div class="item-calculation">
            ${{ getProductById(item.productId)?.price }} × {{ reservationDetails[item.id]?.slots?.length || 0 }} turnos = {{ formatCurrency(getItemPrice(item)) }}
          </div>
        </div>
      </div>
      
      <div class="price-row">
        <span>Subtotal:</span>
        <span>{{ formatCurrency(subtotal) }}</span>
      </div>
      
      <div v-if="hasDiscount" class="price-row discount">
        <span>Descuento (10%):</span>
        <span>-{{ formatCurrency(discount) }}</span>
      </div>
      
      <div class="price-row total">
        <span>Total a Pagar:</span>
        <span>{{ formatCurrency(total) }}</span>
      </div>
    </div>
    
    <div class="summary-section policies-section">
      <h4>Políticas</h4>
      
      <div class="policy">
        <h5>Política de Cancelación</h5>
        <p>- Puedes cancelar hasta 2 horas antes del turno sin cargo alguno.</p>
      </div>
      
      <div class="policy">
        <h5>Política en caso de Tormenta</h5>
        <p>- En caso de condiciones climáticas adversas, se reembolsará el 50% del monto abonado.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation-summary {
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-primary-dark);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-gray-light);
}

.summary-section {
  margin-bottom: var(--space-lg);
}

h4 {
  margin-bottom: var(--space-md);
  color: var(--color-primary);
}

.product-item {
  padding: var(--space-md);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
}

.product-details h5 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-primary-dark);
}

.accessories-list p,
.reservation-details p {
  margin: 0;
  color: var(--color-gray);
}

.reservation-details {
  margin-top: var(--space-xs);
}

.payment-section p {
  margin-bottom: var(--space-xs);
}

.payment-note {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
}

.note {
  margin: 0;
  color: var(--color-white);
  font-size: var(--font-size-sm);
}

.price-breakdown {
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background-color: var(--color-light);
  border-radius: var(--radius-md);
}

.item-breakdown {
  margin-bottom: var(--space-xs);
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

.price-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs) 0;
}

.discount {
  color: var(--color-success);
}

.total {
  font-weight: bold;
  font-size: var(--font-size-lg);
  border-top: 1px solid var(--color-gray-light);
  padding-top: var(--space-sm);
  margin-top: var(--space-sm);
}

.policy {
  margin-bottom: var(--space-md);
}

.policy h5 {
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-gray-dark);
}

.policy p {
  margin: 0;
  color: var(--color-gray);
}
</style>