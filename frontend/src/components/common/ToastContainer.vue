<template>
  <div
    aria-live="polite"
    class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
  >
    <div
      v-for="toast in store.toasts"
      :key="toast.id"
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl bg-[#10141F]/95 backdrop-blur-md transition-all"
      :class="borderClass(toast.type)"
    >
      <div
        class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        :class="iconBgClass(toast.type)"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400" />
        <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-400" />
        <Info v-else class="w-4 h-4 text-sky-400" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-white">{{ toast.title }}</p>
        <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">{{ toast.message }}</p>
      </div>
      <button
        type="button"
        aria-label="Cerrar notificación"
        class="text-slate-400 hover:text-white p-1"
        @click="store.dismissToast(toast.id)"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useEnterpriseStore } from '../../stores/useEnterpriseStore.js'

const store = useEnterpriseStore()

function borderClass(type) {
  if (type === 'success') return 'border-emerald-500/40'
  if (type === 'warning') return 'border-amber-500/40'
  return 'border-sky-500/40'
}

function iconBgClass(type) {
  if (type === 'success') return 'bg-emerald-500/15'
  if (type === 'warning') return 'bg-amber-500/15'
  return 'bg-sky-500/15'
}
</script>
