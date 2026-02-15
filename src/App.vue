<script setup lang="ts">
import { RouterView } from 'vue-router'
import CustomTitleBar from '@/components/CustomTitleBar.vue'
import Header from '@/components/Header.vue';
</script>

<template>
  <div class="app-container">
    <CustomTitleBar />
    <Header />
    <RouterView />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>