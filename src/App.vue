<script setup>
import { h } from 'vue'
import { NConfigProvider } from 'naive-ui'
import AppLayout from "@/views/AppLayout.vue"

const themeOverrides = {
  common: {
    primaryColor: '#090088', // Dark Blue (Base color)
    primaryColorHover: '#2C5282', // Slightly lighter shade for hover state
    primaryColorPressed: '#1C3668', // Slightly darker shade for pressed state
  },
}
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-config-provider>
</template>

<style scoped>
/* Your scoped styles here */
</style>