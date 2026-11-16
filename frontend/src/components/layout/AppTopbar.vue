<template>
  <header
    aria-label="Barra superior de herramientas y usuario"
    class="relative shrink-0 bg-[#06080E] select-none"
    :class="isReferenceDesktop ? 'w-[1427px] h-[82px]' : 'w-full h-[76px] border-b border-[#1B1F29] px-6 flex items-center justify-between'"
  >
    <!-- Modo escritorio de referencia -->
    <template v-if="isReferenceDesktop && referenceTopbarSkin">
      <img
        :src="referenceTopbarSkin"
        alt="Barra superior QuesoPlus"
        class="w-[1427px] h-[82px] object-cover pointer-events-none block"
      />
      <!-- Buscador global interactivo superpuesto -->
      <div class="absolute left-[38px] top-[16px] w-[774px] h-[52px]">
        <label for="qp-global-search" class="sr-only">Buscar en QuesoPlus</label>
        <input
          id="qp-global-search"
          v-model="localQuery"
          type="search"
          aria-label="Buscar en QuesoPlus"
          :class="
            localQuery
              ? 'bg-[#12151E] text-white px-12'
              : 'bg-transparent text-transparent caret-white px-12'
          "
          class="w-full h-full rounded-full text-sm focus:outline-none focus:bg-[#12151E] focus:text-white transition"
          @input="onSearchInput"
          @keydown.enter="emit('open-Launcher')"
        />
      </div>

      <!-- Botón de campana de notificaciones -->
      <button
        type="button"
        aria-label="Ver notificaciones importantes (3)"
        class="absolute left-[1052px] top-[18px] w-[46px] h-[46px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/60"
        title="Notificaciones (3)"
        @click="showNotifications = !showNotifications"
      />

      <!-- Botón de perfil de Pedro Damián Caldera / Selector de 21 módulos -->
      <button
        type="button"
        aria-label="Menú de usuario Pedro Damián Caldera y acceso rápido a módulos"
        class="absolute left-[1130px] top-[14px] w-[225px] h-[54px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/60"
        title="Pedro Damián Caldera — Abrir menú de módulos"
        @click="emit('open-Launcher')"
      />

      <!-- Botón de tema / diagnóstico visual -->
      <button
        type="button"
        aria-label="Abrir selector de los 21 módulos del sistema"
        class="absolute left-[1372px] top-[18px] w-[44px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        title="Mapa de los 21 Módulos de QuesoPlus"
        @click="emit('open-Launcher')"
      />
    </template>

    <!-- Modo estándar para módulos internos y responsive -->
    <template v-else>
      <div class="flex items-center gap-4 flex-1 max-w-2xl">
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            v-model="localQuery"
            type="search"
            aria-label="Buscar productos, lotes, órdenes o procesos"
            placeholder="Buscar productos, lotes, órdenes, clientes o facturas..."
            class="w-full h-11 pl-11 pr-4 rounded-full bg-[#11151F] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500/60"
            @input="onSearchInput"
          />
        </div>
        <button
          type="button"
          class="qp-btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
          @click="emit('open-Launcher')"
        >
          <LayoutGrid class="w-4 h-4 text-red-400" />
          <span>21 Módulos ERP</span>
        </button>
      </div>

      <div class="flex items-center gap-5">
        <button
          type="button"
          aria-label="Ver notificaciones"
          class="relative p-2 rounded-xl hover:bg-white/5 text-slate-200"
          @click="showNotifications = !showNotifications"
        >
          <Bell class="w-5 h-5" />
          <span class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E11D2E] text-[10px] font-bold flex items-center justify-center text-white">
            3
          </span>
        </button>

        <button
          type="button"
          class="flex items-center gap-3 text-left hover:bg-white/5 px-2.5 py-1.5 rounded-xl transition"
          @click="emit('open-Launcher')"
        >
          <img :src="avatarPedro" alt="Pedro Damián Caldera" class="w-10 h-10 rounded-full object-cover border border-white/20" />
          <div class="hidden sm:block">
            <p class="text-xs font-bold text-white leading-tight">{{ store.currentUser.name }}</p>
            <p class="text-[11px] text-slate-400">{{ store.currentUser.role }}</p>
          </div>
          <ChevronDown class="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </template>

    <!-- Popover de Notificaciones en Tiempo Real -->
    <div
      v-if="showNotifications"
      class="absolute right-8 top-[76px] z-50 w-96 qp-card p-4 border border-white/15 bg-[#0E121B] shadow-2xl"
    >
      <div class="flex items-center justify-between pb-3 border-b border-white/10">
        <span class="text-xs font-bold text-white">Centro de Alertas Operativas (3)</span>
        <button
          type="button"
          class="text-[11px] text-slate-400 hover:text-white"
          @click="showNotifications = false"
        >
          Cerrar
        </button>
      </div>
      <div class="divide-y divide-white/10 mt-1">
        <RouterLink
          v-for="alert in store.dashboard.importantAlerts"
          :key="alert.id"
          :to="alert.route"
          class="block py-2.5 hover:bg-white/5 px-2 rounded-lg transition"
          @click="showNotifications = false"
        >
          <p class="text-xs font-semibold text-white">{{ alert.title }}</p>
          <p class="text-[11px] text-slate-400 mt-0.5">{{ alert.time }}</p>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Bell, ChevronDown, LayoutGrid } from 'lucide-vue-next'
import { useEnterpriseStore } from '../../stores/useEnterpriseStore.js'

import avatarPedro from '../../assets/images/avatar-pedro.png'
import dashTopbar from '../../assets/images/skins/dashboard-topbar.png'
import prodTopbar from '../../assets/images/skins/products-topbar.png'
import catTopbar from '../../assets/images/skins/categories-topbar.png'
import presTopbar from '../../assets/images/skins/presentations-topbar.png'
import techTopbar from '../../assets/images/skins/technical-sheets-topbar.png'

const props = defineProps({
  isReferenceDesktop: { type: Boolean, default: false },
  referenceKey: { type: String, default: '' }
})

const emit = defineEmits(['open-Launcher', 'search'])

const store = useEnterpriseStore()
const localQuery = ref('')
const showNotifications = ref(false)

const referenceTopbarSkin = computed(() => {
  const map = {
    dashboard: dashTopbar,
    products: prodTopbar,
    categories: catTopbar,
    presentations: presTopbar,
    'technical-sheets': techTopbar
  }
  return map[props.referenceKey] || null
})

function onSearchInput() {
  store.globalSearchQuery = localQuery.value
  emit('search', localQuery.value)
}
</script>
