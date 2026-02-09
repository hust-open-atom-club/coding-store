<template>
  <div class="title-bar">
    <div class="title-bar-drag-region">
      <div class="window-title">
        Coding Store
      </div>
    </div>
    <div class="window-controls">
      <button 
        class="window-control-btn minimize-btn"
        @click="minimizeWindow"
        aria-label="最小化"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button 
        class="window-control-btn maximize-btn"
        @click="toggleMaximizeWindow"
        aria-label="最大化"
      >
        <svg v-if="!isMaximized" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10V4H10M14 4H10V10M10 14V10H4M20 14V10H14M14 20V14H20M20 20H14V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button 
        class="window-control-btn close-btn"
        @click="closeWindow"
        aria-label="关闭"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { Window } from '@tauri-apps/api/window';

const appWindow = new Window('main');

const isMaximized = ref(false);

const minimizeWindow = async () => {
console.log('minimize');
  await appWindow.minimize();
};

const toggleMaximizeWindow = async () => {
    console.log('maximize');
  await appWindow.toggleMaximize();
  isMaximized.value = !isMaximized.value;
};

const closeWindow = async () => {
    console.log('close');
  await appWindow.close();
};
</script>

<style scoped>
.title-bar {
  height: 40px;
  background: linear-gradient(to bottom, #ffffff, #f5f5f5);
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  -webkit-app-region: drag;
  user-select: none;
  box-sizing: border-box;
}

.dark .title-bar {
  background: linear-gradient(to bottom, #1f2937, #111827);
  border-bottom: 1px solid #374151;
}

.title-bar-drag-region {
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
}

.window-title {
  -webkit-app-region: no-drag;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .window-title {
  color: #d1d5db;
}

.window-controls {
  display: flex;
  height: 30px;
  margin-right: 2px;
}

.window-control-btn {
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #6b7280;
  transition: background-color 0.2s ease;
}

.window-control-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark .window-control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-btn:hover {
  background-color: #ff5f57 !important;
  color: white;
}

.minimize-btn:hover {
  background-color: #febc2e !important;
  color: white;
}

.maximize-btn:hover {
  background-color: #28c840 !important;
  color: white;
}
</style>