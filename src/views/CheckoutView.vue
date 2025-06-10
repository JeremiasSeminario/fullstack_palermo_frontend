<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCheckoutStore } from '../stores/checkout'
import { useConfirmedReservationStore } from '../stores/confirmedReservation'
import CustomerInfoForm from '../components/checkout/CustomerInfoForm.vue'
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector.vue'
import ReservationSummary from '../components/checkout/ReservationSummary.vue'
import customerService from '../api/customerService'
import rentalService from '../api/rentalService'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const confirmedReservationStore = useConfirmedReservationStore()

const customerInfo = ref(checkoutStore.customerInfo)
const paymentMethod = ref(checkoutStore.paymentMethod)

const isFormValid = computed(() => {
  return (
    customerInfo.value.name.trim() !== '' &&
    customerInfo.value.email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.value.email) &&
    customerInfo.value.dni.trim() !== ''
  )
})

// Carro vacío?
const hasItems = computed(() => cartStore.itemCount > 0)
const allItemsHaveReservations = computed(() => {
  return cartStore.cartItems.every(item => 
    cartStore.reservationDetails[item.id] && 
    cartStore.reservationDetails[item.id].slots.length > 0
  )
})

function updateCustomerInfo(info) {
  customerInfo.value = info
  checkoutStore.updateCustomerInfo(info)
}

function updatePaymentMethod(method) {
  paymentMethod.value = method
  checkoutStore.setPaymentMethod(method)
}

async function confirmReservation() {
  if (!isFormValid.value || !hasItems.value || !allItemsHaveReservations.value) return

  // Crear o buscar cliente
  let customer
  try {
    customer = await customerService.createOrGetCustomer({
      dni: customerInfo.value.dni,
      name: customerInfo.value.name,
      email: customerInfo.value.email,
    })
  } catch (err) {
    alert('Error creando cliente: ' + (err?.response?.data?.error || err.message))
    return
  }

  // Preparar rentals
  const rentalsData = cartStore.cartItems.flatMap(item => {
    const details = cartStore.reservationDetails[item.id]
    if (!details || !details.slots.length) return []
    const sortedSlots = [...details.slots].sort()
    return sortedSlots.map(slot => ({
      product: item.productId,
      customer: customer._id,
      date: details.date,
      startTime: slot,
      endTime: getEndTime(slot),
      peopleCount: item.persons,
      paymentMethod: paymentMethod.value,
      isPaid: paymentMethod.value !== 'cash',
      includesHelmet: item.accessories?.some(a => a.id === 'helmet') || false,
      includesLifeJacket: item.accessories?.some(a => a.id === 'lifeJacket') || false,
      currency: customerInfo.value.currency === 'local' ? 'ARS' : 'USD'
    }))
  })

  try {
    await rentalService.createRentals(rentalsData)
    // Guarda el resumen en el store
    confirmedReservationStore.setSummary({
      cartItems: cartStore.cartItems,
      reservationDetails: cartStore.reservationDetails,
      paymentMethod: paymentMethod.value,
      subtotal: cartStore.subtotal,
      total: cartStore.total,
      discount: cartStore.discount,
      hasDiscount: cartStore.hasDiscount,
      customerInfo: customerInfo.value
    })
    cartStore.clearCart()
    checkoutStore.resetCheckout()
    router.push('/confirmation')
  } catch (err) {
    alert('Error creando reservas: ' + (err?.response?.data?.error || err.message))
  }
}

function goBack() {
  router.push('/')
}

function getEndTime(slot) {
  // slot: "HH:mm"
  const [h, m] = slot.split(':').map(Number)
  let date = new Date(2000, 0, 1, h, m)
  date.setMinutes(date.getMinutes() + 30)
  return date.toTimeString().slice(0,5)
}
</script>

<template>
  <div class="checkout-view">
    <div class="checkout-header">
      <button @click="goBack" class="back-button">&larr; Volver</button>
      <h2>Finalizar Reserva</h2>
    </div>
    
    <div v-if="hasItems && allItemsHaveReservations" class="checkout-container">
      <div class="checkout-form">
        <CustomerInfoForm 
          :initialInfo="customerInfo"
          @update="updateCustomerInfo"
        />
        
        <PaymentMethodSelector 
          :initialMethod="paymentMethod"
          @update="updatePaymentMethod"
        />
        
        <div class="checkout-actions">
          <button 
            @click="confirmReservation" 
            class="confirm-button"
            :disabled="!isFormValid"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
      
      <div class="checkout-summary">
        <ReservationSummary />
      </div>
    </div>
    
    <div v-else-if="hasItems && !allItemsHaveReservations" class="incomplete-reservations">
      <h3>Reservas incompletas</h3>
      <p>Algunos productos en tu carrito no tienen horarios seleccionados.</p>
      <router-link to="/">
        <button>Volver a productos</button>
      </router-link>
    </div>
    
    <div v-else class="empty-cart-message">
      <h3>Tu carrito está vacío</h3>
      <p>Agrega productos para continuar con la reserva.</p>
      <router-link to="/">
        <button>Ver productos disponibles</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.checkout-view {
  width: 100%;
  background-color: var(--color-light);
  min-height: 100vh;
  padding: var(--space-xl) 0;
}

.checkout-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.back-button {
  background-color: transparent;
  color: var(--color-primary);
  padding: 0;
  margin-bottom: var(--space-sm);
  border: none;
  font-size: var(--font-size-md);
  cursor: pointer;
}

.back-button:hover {
  color: var(--color-primary-dark);
  background-color: transparent;
}

.checkout-header h2 {
  color: var(--color-primary-dark);
  margin: 0;
  font-size: var(--font-size-xxl);
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
  max-width: 1100px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  box-shadow: none;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.checkout-actions {
  margin-top: var(--space-lg);
}

.confirm-button {
  width: 100%;
  padding: var(--space-md);
  font-size: var(--font-size-lg);
  background-color: var(--color-success);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  transition: none;
}

.confirm-button:hover:enabled {
  background-color: var(--color-success);
  opacity: 0.9;
}

.confirm-button:disabled,
.confirm-button:disabled:hover {
  background-color: var(--color-success);
  color: var(--color-white);
  cursor: not-allowed;
  opacity: 0.6;
}

.checkout-summary {
  background: var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.incomplete-reservations,
.empty-cart-message {
  text-align: center;
  padding: var(--space-xxl) 0;
  background: var(--color-white);
  border-radius: var(--radius-md);
  max-width: 600px;
  margin: var(--space-xl) auto 0 auto;
}

.incomplete-reservations h3,
.empty-cart-message h3 {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-md);
  font-size: var(--font-size-xl);
}

.incomplete-reservations p,
.empty-cart-message p {
  color: var(--color-gray);
  margin-bottom: var(--space-lg);
}

@media (min-width: 992px) {
  .checkout-container {
    grid-template-columns: 3fr 2fr;
    padding: var(--space-xxl);
  }
  .checkout-summary {
    position: sticky;
    top: var(--space-lg);
  }
}
</style>