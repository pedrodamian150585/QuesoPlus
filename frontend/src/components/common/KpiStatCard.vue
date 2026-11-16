<template>
  <div
    class="qp-card relative overflow-hidden px-4 py-3.5 flex items-center gap-3.5 border border-white/[0.08] transition hover:border-white/15"
    :class="compact ? 'h-[88px]' : 'h-[118px]'"
  >
    <!-- Glowing Icon Circle -->
    <div
      class="relative shrink-0 rounded-full flex items-center justify-center"
      :class="[compact ? 'w-14 h-14' : 'w-16 h-16', circleGlowClass]"
    >
      <img
        v-if="iconAssetUrl"
        :src="iconAssetUrl"
        :alt="title"
        class="w-full h-full object-contain rounded-full"
      />
      <component :is="resolvedIcon" v-else class="w-7 h-7 text-white" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 z-10">
      <div class="flex items-center justify-between gap-2">
        <p class="text-[13px] font-medium text-slate-300 truncate">{{ title }}</p>
        <span v-if="showPlusBadge" class="text-xs font-bold text-slate-400">+</span>
      </div>
      <div class="flex items-baseline justify-between gap-2 mt-1">
        <p class="text-[24px] leading-tight font-bold text-white tracking-tight">
          {{ value }}
        </p>
        <span
          v-if="delta"
          class="text-xs font-semibold flex items-center gap-0.5"
          :class="deltaColorClass"
        >
          <span v-if="delta.startsWith('+')">↑</span>
          {{ delta }}
        </span>
      </div>
    </div>

    <!-- Decorative bottom-right sparkline wave -->
    <svg
      v-if="sparkline && sparkline.length"
      class="absolute bottom-1 right-2 w-36 h-11 opacity-85 pointer-events-none"
      viewBox="0 0 140 44"
      fill="none"
    >
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="strokeColor" stop-opacity="0.38" />
          <stop offset="100%" :stop-color="strokeColor" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <path :d="areaPath" :fill="`url(#${gradId})`" />
      <path :d="linePath" :stroke="strokeColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Box, ShoppingCart, Truck, CheckCircle2, Star, PauseCircle, TrendingUp } from 'lucide-vue-next'

import iconRedBox from '../../assets/images/icon-kpi-red-box.png'
import iconAmberCart from '../../assets/images/icon-kpi-amber-cart.png'
import iconBlueTruck from '../../assets/images/icon-kpi-blue-truck.png'
import iconGreenCheck from '../../assets/images/icon-kpi-green-check.png'
import iconPurpleStar from '../../assets/images/icon-kpi-purple-star.png'
import iconPurpleBox from '../../assets/images/icon-kpi-purple-box.png'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  delta: { type: String, default: '' },
  color: { type: String, default: 'red' },
  icon: { type: String, default: 'box' },
  sparkline: { type: Array, default: () => [] },
  compact: { type: Boolean, default: false },
  showPlusBadge: { type: Boolean, default: false },
  useAssetIcon: { type: Boolean, default: true }
})

const gradId = computed(() => `spark-${props.title.replace(/\W+/g, '').toLowerCase()}`)

const iconAssetUrl = computed(() => {
  if (!props.useAssetIcon) return null
  if (props.color === 'red' && props.icon === 'box') return iconRedBox
  if (props.color === 'amber' && props.icon === 'shopping-cart') return iconAmberCart
  if (props.color === 'blue' && props.icon === 'truck') return iconBlueTruck
  if (props.color === 'green' && props.icon === 'check-circle') return iconGreenCheck
  if (props.color === 'purple' && props.icon === 'star') return iconPurpleStar
  if (props.color === 'purple' && props.icon === 'box') return iconPurpleBox
  return null
})

const resolvedIcon = computed(() => {
  const map = {
    box: Box,
    'shopping-cart': ShoppingCart,
    truck: Truck,
    'check-circle': CheckCircle2,
    star: Star,
    pause: PauseCircle,
    trending: TrendingUp
  }
  return map[props.icon] || Box
})

const circleGlowClass = computed(() => {
  const map = {
    red: 'bg-[#B00110]/25 shadow-[0_0_20px_rgba(225,29,46,0.4)]',
    amber: 'bg-[#CF8004]/25 shadow-[0_0_20px_rgba(245,158,11,0.38)]',
    blue: 'bg-[#0567C0]/25 shadow-[0_0_20px_rgba(14,165,233,0.38)]',
    green: 'bg-[#05972E]/25 shadow-[0_0_20px_rgba(16,185,129,0.38)]',
    purple: 'bg-[#7C3AED]/25 shadow-[0_0_20px_rgba(139,92,246,0.38)]'
  }
  return map[props.color] || map.red
})

const deltaColorClass = computed(() => {
  if (props.color === 'amber' && props.delta === '0%') return 'text-amber-400'
  if (props.color === 'purple' && props.delta.includes('+0')) return 'text-purple-400'
  if (props.color === 'blue' && props.delta.includes('+0')) return 'text-sky-400'
  return 'text-emerald-400'
})

const strokeColor = computed(() => {
  const map = {
    red: '#E11D2E',
    amber: '#F59E0B',
    blue: '#0EA5E9',
    green: '#10B981',
    purple: '#8B5CF6'
  }
  return map[props.color] || '#E11D2E'
})

const pointsCoords = computed(() => {
  const arr = props.sparkline
  if (!arr || !arr.length) return []
  const max = Math.max(...arr, 1)
  const min = Math.min(...arr, 0)
  const range = Math.max(max - min, 1)
  return arr.map((v, idx) => {
    const x = Math.round((idx / (arr.length - 1)) * 134) + 3
    const y = Math.round(38 - ((v - min) / range) * 28)
    return [x, y]
  })
})

const linePath = computed(() => {
  const pts = pointsCoords.value
  if (!pts.length) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
})

const areaPath = computed(() => {
  const pts = pointsCoords.value
  if (!pts.length) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  return `${linePath.value} L ${last[0]} 43 L ${first[0]} 43 Z`
})
</script>
