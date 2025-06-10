<script setup>
import { ref, computed, watch } from 'vue'
import { useProductsStore } from '../../stores/products'

const props = defineProps({ productId: String, initialValue: Number })
const emit = defineEmits(['update'])
const productsStore = useProductsStore()
const product = computed(() => productsStore.getProductById(props.productId))
const maxPersons = computed(() => Number(product.value?.maxPersons) || 1)
const personCount = ref(props.initialValue || 1)

function increment() {
  if (personCount.value < maxPersons.value) {
    personCount.value++
    emit('update', personCount.value)
  }
}
function decrement() {
  if (personCount.value > 1) {
    personCount.value--
    emit('update', personCount.value)
  }
}
watch(() => props.initialValue, v => { if (v) personCount.value = v })
</script>

<template>
  <div class="person-selector">
    <h4>Cantidad de personas</h4>
    
    <div class="selector-controls">
      <button 
        type="button" 
        class="control-button"
        @click="decrement"
        :disabled="personCount <= 1"
      >
        -
      </button>
      
      <span class="person-count">{{ personCount }}</span>
      
      <button 
        type="button" 
        class="control-button"
        @click="increment"
        :disabled="personCount >= maxPersons"
      >
        +
      </button>
    </div>
    
    <p class="max-info">Máximo {{ maxPersons }} {{ maxPersons === 1 ? 'persona' : 'personas' }} para este producto</p>
  </div>
</template>

<style scoped>
.person-selector {
  margin-bottom: var(--space-lg);
}

h4 {
  margin-bottom: var(--space-md);
  color: var(--color-primary-dark);
}

.selector-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  padding: 0;
}

.person-count {
  font-size: var(--font-size-xl);
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.max-info {
  text-align: center;
  margin-top: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}
</style>