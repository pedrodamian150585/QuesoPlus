<template>
  <div class="relative flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="#1C202B"
        :stroke-width="strokeWidth"
      />
      <circle
        v-for="(seg, idx) in computedSegments"
        :key="idx"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="seg.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="`${seg.length} ${circumference - seg.length}`"
        :stroke-dashoffset="-seg.offset"
        stroke-linecap="butt"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
      <span class="font-bold text-white leading-none" :class="valueClass">{{ centerValue }}</span>
      <span v-if="centerLabel" class="text-[11px] text-slate-300 mt-1">{{ centerLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: Number, default: 146 },
  strokeWidth: { type: Number, default: 18 },
  centerValue: { type: [String, Number], required: true },
  centerLabel: { type: String, default: '' },
  valueClass: { type: String, default: 'text-2xl' },
  segments: {
    type: Array,
    default: () => [
      { value: 72, color: '#10B981' },
      { value: 14, color: '#F59E0B' },
      { value: 14, color: '#E11D2E' }
    ]
  }
})

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2 - 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const computedSegments = computed(() => {
  const total = props.segments.reduce((acc, s) => acc + Number(s.value || 0), 0) || 1
  let accumulatedOffset = 0
  return props.segments.map((seg) => {
    const ratio = Number(seg.value || 0) / total
    const length = ratio * circumference.value
    const item = {
      color: seg.color,
      length,
      offset: accumulatedOffset
    }
    accumulatedOffset += length
    return item
  })
})
</script>
