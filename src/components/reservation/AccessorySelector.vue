<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  accessories: Array,
  initialSelected: Array
})

const emit = defineEmits(['update'])

const selectedAccessories = ref(
  props.initialSelected || 
  props.accessories.filter(acc => acc.required)
)

// Watch for changes to accessories prop
watch(() => props.accessories, (newAccessories) => {
  // Make sure required accessories are always selected
  const requiredAccessories = newAccessories.filter(acc => acc.required)
  
  // Keep previously selected non-required accessories if they still exist
  const nonRequiredSelected = selectedAccessories.value
    .filter(acc => !acc.required)
    .filter(acc => newAccessories.some(newAcc => newAcc.id === acc.id))
  
  selectedAccessories.value = [...requiredAccessories, ...nonRequiredSelected]
  emitUpdate()
})

function toggleAccessory(accessory) {
  if (accessory.required) return // Can't toggle required accessories
  
  const index = selectedAccessories.value.findIndex(acc => acc.id === accessory.id)
  
  if (index === -1) {
    selectedAccessories.value.push(accessory)
  } else {
    selectedAccessories.value.splice(index, 1)
  }
  
  emitUpdate()
}

function isSelected(accessory) {
  return selectedAccessories.value.some(acc => acc.id === accessory.id)
}

function emitUpdate() {
  emit('update', selectedAccessories.value)
}

// Initialize with required accessories
if (selectedAccessories.value.length === 0) {
  selectedAccessories.value = props.accessories.filter(acc => acc.required)
  emitUpdate()
}
</script>

<template>
  <div class="accessory-selector">
    <h4>Accesorios</h4>
    
    <div class="accessories-list">
      <div 
        v-for="accessory in accessories" 
        :key="accessory.id"
        :class="['accessory-item', { 
          selected: isSelected(accessory),
          required: accessory.required 
        }]"
        @click="toggleAccessory(accessory)"
      >
        <div class="accessory-checkbox">
          <div class="checkbox-inner"></div>
        </div>
        
        <div class="accessory-info">
          <span class="accessory-name">{{ accessory.name }}</span>
          <span class="accessory-price">${{ accessory.price }}</span>
          <span v-if="accessory.required" class="required-badge">Obligatorio</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accessory-selector {
  margin-bottom: var(--space-lg);
}

h4 {
  margin-bottom: var(--space-md);
  color: var(--color-primary-dark);
}

.accessories-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.accessory-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-light);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all 0.2s;
}

.accessory-item:hover:not(.required) {
  border-color: var(--color-primary-light);
}

.accessory-item.selected {
  background-color: var(--color-secondary);
  border-color: var(--color-primary);
}

.accessory-item.required {
  background-color: var(--color-secondary);
  border-color: var(--color-primary-light);
  cursor: default;
}

.accessory-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid var(--color-gray-light);
  margin-right: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.accessory-item.selected .accessory-checkbox {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

.checkbox-inner {
  width: 10px;
  height: 10px;
  background-color: var(--color-white);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.2s;
}

.accessory-item.selected .checkbox-inner {
  opacity: 1;
}

.accessory-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accessory-name {
  flex: 1;
}

.accessory-price {
  margin-right: var(--space-md);
  font-weight: 500;
  color: var(--color-primary-dark);
}

.required-badge {
  font-size: var(--font-size-sm);
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
</style>