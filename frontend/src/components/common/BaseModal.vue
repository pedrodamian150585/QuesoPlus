<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="modalTitleId"
      @keydown.esc="close"
    >
      <div
        class="qp-card w-full border border-white/15 bg-[#0C0F17] shadow-2xl overflow-hidden"
        :class="maxWidthClass"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111520]">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-[#E11D2E] shadow-[0_0_10px_#E11D2E]"></span>
            <h2 :id="modalTitleId" class="text-base font-bold text-white tracking-tight">
              {{ title }}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            @click="close"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 max-h-[78vh] overflow-y-auto text-sm text-slate-200">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#090C12]"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Detalle del Registro'
  },
  size: {
    type: String,
    default: 'md'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalTitleId = computed(() => `qp-modal-title-${props.title.replace(/\s+/g, '-').toLowerCase()}`)

const maxWidthClass = computed(() => {
  if (props.size === 'lg') return 'max-w-3xl'
  if (props.size === 'xl') return 'max-w-5xl'
  return 'max-w-xl'
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>
