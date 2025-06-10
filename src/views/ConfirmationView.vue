<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirmedReservationStore } from '../stores/confirmedReservation'
import ReservationSummary from '../components/checkout/ReservationSummary.vue'

const router = useRouter()
const confirmedReservationStore = useConfirmedReservationStore()

const summary = computed(() => confirmedReservationStore.summary)
const customerInfo = computed(() => summary.value?.customerInfo || { name: '', email: '', dni: '', currency: 'local' })
const paymentMethod = computed(() => summary.value?.paymentMethod || 'cash')
const reservationNumber = computed(() => Math.floor(100000 + Math.random() * 900000))

onMounted(() => {
  if (!summary.value) {
    router.push('/')
  }
})

function finishProcess() {
  confirmedReservationStore.clearSummary()
  router.push('/')
}
</script>

<template>
  <div class="confirmation-view" v-if="summary">
    <div class="confirmation-header">
      <div class="success-icon">✓</div>
      <h2>¡Reserva Confirmada!</h2>
      <p class="confirmation-message">
        Gracias {{ customerInfo.name || '-' }} por tu reserva. Hemos enviado los detalles a tu correo electrónico.
      </p>
      <p class="reservation-number">
        Tu número de reserva es: <strong>#{{ reservationNumber }}</strong>
      </p>
    </div>
    
    <div class="customer-info-section">
      <h3>Información del Cliente</h3>
      <div class="customer-details">
        <div class="info-row">
          <span class="label">Nombre:</span>
          <span class="value">{{ customerInfo.name || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ customerInfo.email || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">DNI:</span>
          <span class="value">{{ customerInfo.dni || '-' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Moneda:</span>
          <span class="value">{{ customerInfo.currency === 'local' ? 'Pesos (ARS)' : 'Dólares (USD)' }}</span>
        </div>
      </div>
    </div>
    
    <div class="payment-instructions" v-if="paymentMethod === 'cash'">
      <h3>Instrucciones de Pago</h3>
      <p>
        Recuerda que debes realizar el pago en efectivo en nuestro parador al menos 2 horas antes 
        de tu horario reservado. Por favor, menciona tu número de reserva al momento de pagar.
      </p>
    </div>
    
    <div class="confirmation-summary">
      <ReservationSummary
        :cart-items="summary.cartItems"
        :reservation-details="summary.reservationDetails"
        :payment-method="summary.paymentMethod"
        :subtotal="summary.subtotal"
        :total="summary.total"
        :discount="summary.discount"
        :has-discount="summary.hasDiscount"
      />
    </div>
    
    <div class="confirmation-actions">
      <button @click="finishProcess" class="finish-button">
        Volver a la página principal
      </button>
    </div>
  </div>
</template>

<style scoped>
.confirmation-view {
  background-color: var(--color-secondary);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.confirmation-header {
  text-align: center;
  margin-bottom: var(--space-xxl);
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: var(--color-success);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto var(--space-lg);
}

.confirmation-header h2 {
  color: var(--color-success);
  margin-bottom: var(--space-md);
}

.confirmation-message {
  color: var(--color-gray-dark);
  margin-bottom: var(--space-sm);
}

.reservation-number {
  font-size: var(--font-size-lg);
  color: var(--color-primary-dark);
}

.customer-info-section {
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-xl);
}

.customer-info-section h3 {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-gray-light);
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) 0;
}

.label {
  font-weight: 500;
  color: var(--color-gray-dark);
}

.value {
  color: var(--color-primary-dark);
  font-weight: 500;
}

.payment-instructions {
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.payment-instructions h3 {
  color: var(--color-primary-dark);
  margin-bottom: var(--space-sm);
}

.payment-instructions p {
  color: var(--color-gray-dark);
  margin: 0;
}

.confirmation-summary {
  margin-bottom: var(--space-xl);
}

.confirmation-actions {
  text-align: center;
  margin-top: var(--space-xl);
}

.finish-button {
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-lg);
}

@media (min-width: 768px) {
  .customer-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background-color: var(--color-light);
    border-radius: var(--radius-md);
  }
}
</style>