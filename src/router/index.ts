import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AppDetail from '@/views/AppDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/app/:id',
      name: 'app-detail',
      component: AppDetail,
      props: true
    }
  ]
})

export default router