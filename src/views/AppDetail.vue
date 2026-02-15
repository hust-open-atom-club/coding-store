<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Download, Star, X } from 'lucide-vue-next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from 'vue-toastification'

const toast = useToast()

const installApp = () => {
  if (!app.value) return;
  if (app.value.url) {
    window.open(app.value.url, '_blank');
    toast?.success(`开始下载 ${app.value.name}`)
  } else {
    alert(`暂不支持直接安装 ${app.value.name}`);
  }
};

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

const route = useRoute();
const appId = ref(route.params.id);
const app = ref<AppItem | null>(null);
const loading = ref(true);
const isModalOpen = ref(false);
const currentImage = ref('');

onMounted(async () => {
  try {
    // 获取所有应用数据
    const response = await fetch('https://raw.githubusercontent.com/hust-open-atom-club/coding-store/refs/heads/main/registry/apps.json');
    const appsData: AppItem[] = await response.json();
    
    // 根据ID查找特定应用
    const foundApp = appsData.find(a => a.id.toString() === appId.value);
    app.value = foundApp || null;
  } catch (error) {
    console.error('获取应用详情失败:', error);
  } finally {
    loading.value = false;
  }
});

const openImageModal = (imageSrc: string) => {
  currentImage.value = imageSrc;
  isModalOpen.value = true;
};

const closeImageModal = () => {
  isModalOpen.value = false;
  currentImage.value = '';
};
</script>

<template>
  <div class="min-h-[calc(100vh-40px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <main class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="!app" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">应用未找到</h2>
        <p class="text-gray-600 dark:text-gray-400">抱歉，找不到指定的应用。</p>
      </div>

      <Card v-else class="max-w-4xl mx-auto overflow-hidden">
        <CardHeader class="pb-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img :src="app.icon" :alt="app.name" class="w-16 h-16 rounded-lg object-cover" />
            <div class="flex-1 text-center sm:text-left">
              <CardTitle class="text-3xl">{{ app.name }}</CardTitle>
              <CardDescription class="text-lg mt-2">{{ app.description }}</CardDescription>
              
              <div class="flex flex-wrap items-center gap-4 mt-4">
                <div class="flex items-center gap-2">
                  <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span class="font-medium">{{ app.rating }}/5.0</span>
                </div>
                
                <div class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {{ app.category }}
                </div>
                
                <div v-if="app.version" class="text-sm text-gray-600 dark:text-gray-400">
                  版本: {{ app.version[0].version }}
                </div>
                
                <div v-if="app.size" class="text-sm text-gray-600 dark:text-gray-400">
                  大小: {{ app.size }}
                </div>
              </div>
              
              <div v-if="app.developer" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                开发者: {{ app.developer }}
              </div>

              <div v-if="app.url" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                官网: <a class="mt-2 text-sm text-blue-600 dark:text-blue-400" :href="app.url" target="_blank">{{ app.url }}</a>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent class="pt-0">
          <!-- Screenshots -->
          <div v-if="app.screenshots && app.screenshots.length > 0" class="mb-8">
            <h3 class="text-xl font-semibold mb-4">截图</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <img 
                v-for="(screenshot, index) in app.screenshots" 
                :key="index" 
                :src="screenshot" 
                :alt="`Screenshot ${index + 1}`" 
                class="rounded-lg shadow-md w-full object-cover max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
                @click="openImageModal(screenshot)"
              />
            </div>
          </div>
          
          <!-- Image Modal -->
           <div 
            v-if="isModalOpen" 
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click="closeImageModal"
          >
            <div class="relative max-w-4xl max-h-full" @click.stop>
              <button 
                class="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 z-10"
                @click="closeImageModal"
              >
                <X class="w-5 h-5" />
              </button>
              <img 
                :src="currentImage" 
                :alt="`Enlarged screenshot`"
                class="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
          
          <!-- Description -->
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <h3 class="text-xl font-semibold mb-2">应用介绍</h3>
            <p class="text-gray-700 dark:text-gray-300">{{ app.description }}</p>
          </div>
        </CardContent>
        
        <CardFooter class="flex flex-col sm:flex-row gap-3">
          <Button class="w-full sm:w-auto" @click.stop="installApp">
            <Download class="w-4 h-4 mr-2" />
            安装应用
          </Button>
          <Button variant="outline" class="w-full sm:w-auto">
            分享
          </Button>
        </CardFooter>
      </Card>
    </main>
  </div>
</template>