<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
const searchQuery = ref('')
</script>

<template>
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <a href="/">
                <div class="flex items-center space-x-2">
                    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Coding Store</h1>
                </div>
            </a>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                v-model="searchQuery"
                placeholder="搜索应用..."
                class="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
</template>