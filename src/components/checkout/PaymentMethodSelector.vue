<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialMethod: {
    type: String,
    default: 'cash'
  }
})

const emit = defineEmits(['update'])

const paymentMethod = ref(props.initialMethod)

function updateMethod(method) {
  paymentMethod.value = method
  emit('update', paymentMethod.value)
}

// Watch for prop changes
watch(() => props.initialMethod, (newMethod) => {
  if (newMethod) {
    paymentMethod.value = newMethod
  }
})
</script>

<template>
  <div class="payment-method-selector">
    <h3>Método de Pago</h3>
    
    <div class="payment-options">
      <div 
        class="payment-option"
        :class="{ active: paymentMethod === 'cash' }"
        @click="updateMethod('cash')"
      >
        <div class="option-header">
          <div class="option-radio">
            <div class="radio-inner"></div>
          </div>
          <h4>Pagar en efectivo en el parador</h4>
        </div>
        
        <div class="option-info">
          <p>Realiza el pago directamente en nuestro parador de playa.</p>
          <p class="important-note">Importante: El pago debe realizarse al menos 2 horas antes del turno.</p>
        </div>
      </div>
      
      <div 
        class="payment-option"
        :class="{ active: paymentMethod === 'card' }"
        @click="updateMethod('card')"
      >
        <div class="option-header">
          <div class="option-radio">
            <div class="radio-inner"></div>
          </div>
          <h4>Pagar online</h4>
        </div>
        
        <div class="option-info">
          <p>Realiza el pago ahora mismo con tarjeta de crédito o débito.</p>
          <p>Aceptamos todas las tarjetas principales.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-method-selector {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-xl);
}

h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-primary-dark);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.payment-option {
  border: 2px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: var(--color-primary-light);
}

.payment-option.active {
  border-color: var(--color-primary);
  background-color: var(--color-secondary);
}

.option-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.option-radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-gray);
  margin-right: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-option.active .option-radio {
  border-color: var(--color-primary);
}

.radio-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-primary);
  opacity: 0;
  transition: opacity 0.2s;
}

.payment-option.active .radio-inner {
  opacity: 1;
}

.option-header h4 {
  margin: 0;
  color: var(--color-gray-dark);
}

.payment-option.active .option-header h4 {
  color: var(--color-primary-dark);
}

.option-info {
  padding-left: calc(24px + var(--space-md));
}

.option-info p {
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-gray);
}

.important-note {
  color: var(--color-warning) !important;
  font-weight: 500;
}
</style>