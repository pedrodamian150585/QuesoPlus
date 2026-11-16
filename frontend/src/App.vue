<template>
  <MainEnterpriseLayout v-slot="{ isReferenceDesktop }">
    <RouterView v-slot="{ Component }">
      <component :is="Component" :is-reference-desktop="isReferenceDesktop" />
    </RouterView>
  </MainEnterpriseLayout>
</template>

<script setup>
import MainEnterpriseLayout from './layouts/MainEnterpriseLayout.vue'
</script>
