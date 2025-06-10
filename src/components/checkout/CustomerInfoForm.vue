<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialInfo: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      dni: '',
      currency: 'local'
    })
  }
})

const emit = defineEmits(['update'])

const customerInfo = ref(props.initialInfo)

function updateField(field, value) {
  customerInfo.value[field] = value
  emitUpdate()
}

function emitUpdate() {
  emit('update', { ...customerInfo.value })
}

watch(() => props.initialInfo, (newInfo) => {
  if (newInfo) {
    customerInfo.value = { ...newInfo }
  }
})
</script>

<template>
  <div class="customer-info-form">
    <h3>Información del Cliente</h3>
    
    <div class="form-group">
      <label for="customer-name">Nombre Completo</label>
      <input 
        type="text" 
        id="customer-name"
        v-model="customerInfo.name"
        @input="updateField('name', $event.target.value)"
        placeholder="Ingresa tu nombre completo"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="customer-dni">DNI o Documento de Identidad</label>
      <input 
        type="text" 
        id="customer-dni"
        v-model="customerInfo.dni"
        @input="updateField('dni', $event.target.value)"
        placeholder="Ingresa tu número de documento"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="customer-email">Correo Electrónico</label>
      <input 
        type="email" 
        id="customer-email"
        v-model="customerInfo.email"
        @input="updateField('email', $event.target.value)"
        placeholder="ejemplo@correo.com"
        required
      />
    </div>
    
    <div class="form-group">
      <label>Moneda de Pago</label>
      <div class="currency-selector">
        <label class="radio-label">
          <input 
            type="radio" 
            name="currency" 
            value="local"
            :checked="customerInfo.currency === 'local'"
            @change="updateField('currency', 'local')"
          />
          <span class="radio-text">Moneda Local (Pesos)</span>
        </label>
        
        <label class="radio-label">
          <input 
            type="radio" 
            name="currency" 
            value="foreign"
            :checked="customerInfo.currency === 'foreign'"
            @change="updateField('currency', 'foreign')"
          />
          <span class="radio-text">Moneda Extranjera (Dólares)</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-info-form {
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

.form-group {
  margin-bottom: var(--space-lg);
}

label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 500;
  color: var(--color-gray-dark);
}

input[type="text"],
input[type="email"] {
  width: 100%;
}

.currency-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="radio"] {
  margin-right: var(--space-sm);
}

.radio-text {
  font-weight: normal;
}

@media (min-width: 768px) {
  .currency-selector {
    flex-direction: row;
    gap: var(--space-xl);
  }
}
</style>