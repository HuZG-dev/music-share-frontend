<template>
  <div class="placeholder-image" :style="style">
    <slot>{{ text }}</slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 280
  },
  height: {
    type: [String, Number],
    default: 160
  },
  bgColor: {
    type: String,
    default: '#667eea'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  text: {
    type: String,
    default: '图片占位'
  }
})

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  backgroundColor: props.bgColor,
  color: props.textColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px'
}))
</script>