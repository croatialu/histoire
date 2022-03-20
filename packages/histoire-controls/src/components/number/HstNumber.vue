<script lang="ts">
export default {
  name: 'HstNumber',

  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { computed, ref, onUnmounted } from 'vue'
import HstWrapper from '../HstWrapper.vue'

const props = defineProps<{
  title?: string
  modelValue: number
}>()

const emit = defineEmits({
  'update:modelValue': (newValue: number) => true,
})

const numberModel = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  },
})

const input = ref<HTMLInputElement>()

function focusAndSelect () {
  input.value.focus()
  input.value.select()
}

// Drag to modify

const isDragging = ref(false)
let startX: number
let startValue: number

function onMouseDown (event: MouseEvent) {
  isDragging.value = true
  startX = event.clientX
  startValue = numberModel.value
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDragging)
}

function onMouseMove (event: MouseEvent) {
  let step = parseFloat(input.value.step)
  if (isNaN(step)) {
    step = 1
  }
  numberModel.value = startValue + Math.round((event.clientX - startX) / 10 / step) * step
}

function stopDragging () {
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDragging)
}

onUnmounted(() => {
  stopDragging()
})
</script>

<template>
  <HstWrapper
    class="htw-cursor-ew-resize htw-items-center"
    :title="title"
    :class="[
      $attrs.class,
      { 'htw-select-none': isDragging },
    ]"
    :style="$attrs.style"
    @click="focusAndSelect"
    @mousedown="onMouseDown"
  >
    <input
      ref="input"
      v-bind="$attrs"
      v-model.number="numberModel"
      type="number"
      :class="{
        'htw-select-none': isDragging,
      }"
      class="htw-text-inherit htw-bg-transparent htw-w-full htw-outline-none htw-pl-2 htw-py-0 htw-border htw-border-solid htw-border-gray-300 dark:htw-border-gray-500 focus:htw-border-primary-500 dark:focus:htw-border-primary-500 htw-rounded-sm htw-cursor-ew-resize"
    >
  </HstWrapper>
</template>