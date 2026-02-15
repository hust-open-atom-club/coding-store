<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Star } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import searchQuery from "@/components/Header.vue"

const toast = useToast()

// 安装
const installApp = (appId: number) => {
  const app = apps.value.find(a => a.id === appId)
  if (!app) return

  if (app.url) {
    window.open(app.url, '_blank')
    toast?.success(`开始下载 ${app.name}`)
  }
}

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'

interface AppItem {
  id: number;
  name: string;
  description: string;
  url?: string;
  category: string;
  rating: number;
  downloads: number;
  icon: string;
  screenshots?: string[];
  version?: Array<{ version: string }>;
  size?: string;
  developer?: string;
  featured?: boolean;
}

const selectedCategory = ref('all')
const loading = ref(true)

const apps = ref<AppItem[]>([])
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'development', name: '开发工具' },
  { id: 'design', name: '设计工具' },
  { id: 'media', name: '媒体播放' },
  { id: 'productivity', name: '生产力' },
  { id: 'utilities', name: '实用工具' },
  { id: 'gaming', name: '游戏' }
])

async function fetchAppsAndCategories() {
  try {
    // 获取apps数据
    const appsResponse = await fetch('https://raw.githubusercontent.com/hust-open-atom-club/coding-store/refs/heads/main/registry/apps.json')
    const appsData = await appsResponse.json()
    apps.value = appsData
    
    // 获取categories数据
    try {
      const categoriesResponse = await fetch('https://raw.githubusercontent.com/hust-open-atom-club/coding-store/refs/heads/main/registry/categories.json')
       if (categoriesResponse.ok) {
         categories.value = await categoriesResponse.json()
       }
     } catch (categoriesError) {
       console.warn('获取分类数据失败，使用默认分类:', categoriesError)
     }
    
    console.log('成功获取应用数据:', appsData)
  } catch (error) {
    console.error('获取应用数据失败:', error)
    // 使用默认数据作为fallback
    apps.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAppsAndCategories()
})

const filteredApps = computed(() => {
  let result = apps.value
  
  if (searchQuery.value) {
    result = result.filter(app => 
      app.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value !== 'all') {
    result = result.filter(app => 
      app.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }
  
  return result
})

const featuredApps = computed(() => {
  return apps.value.filter(app => app.featured)
})
</script>

<template>
  <div class="min-h-[calc(100vh-40px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <main class="container mx-auto px-4 py-8">
      <!-- Featured Apps Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">精选应用</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink 
            v-for="app in featuredApps" 
            :key="app.id"
            :to="{ name: 'app-detail', params: { id: app.id } }"
            class="block"
          >
            <Card class="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between">
                  <div>
                    <CardTitle class="flex items-center gap-2">
                      <span class="text-xl"><img :src="app.icon" alt="app icon" class="w-6 h-6" /></span>
                      {{ app.name }}
                    </CardTitle>
                    <CardDescription class="mt-1">
                      {{ app.description }}
                    </CardDescription>
                  </div>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    精选
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{{ app.rating }}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button class="w-full" @click.stop="installApp(app.id)">
                  <Download class="w-4 h-4 mr-2" />
                  安装
                </Button>
              </CardFooter>
            </Card>
          </RouterLink>
        </div>
      </section>

      <!-- Categories Filter -->
      <section class="mb-8">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="category in categories"
            :key="category.id"
            :variant="selectedCategory === category.id ? 'default' : 'outline'"
            size="sm"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </Button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- All Apps Grid -->
      <section v-else>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          所有应用
          <span class="text-gray-500 text-lg ml-2">
            ({{ filteredApps.length }})
          </span>
        </h2>
        
        <div v-if="filteredApps.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-lg">未找到匹配的应用</div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RouterLink 
            v-for="app in filteredApps" 
            :key="app.id"
            :to="{ name: 'app-detail', params: { id: app.id } }"
            class="block"
          >
            <Card class="overflow-hidden hover:shadow-md transition-shadow h-full">
              <CardHeader class="pb-3">
                <CardTitle class="flex items-center gap-2">
                  <span class="text-xl"><img :src="app.icon" alt="app icon" class="w-6 h-6" /></span>
                  {{ app.name }}
                </CardTitle>
                <CardDescription class="line-clamp-2">
                  {{ app.description }}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <div class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {{ app.category }}
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center gap-1">
                      <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{{ app.rating }}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button class="w-full" @click.stop="installApp(app.id)">
                  <Download class="w-4 h-4 mr-2" />
                  安装
                </Button>
              </CardFooter>
            </Card>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>