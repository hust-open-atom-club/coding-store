<script setup lang="ts">
import { RouterView } from 'vue-router'
import CustomTitleBar from '@/components/CustomTitleBar.vue'
</script>

<template>
  <div class="app-container">
    <CustomTitleBar />
    <RouterView />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>