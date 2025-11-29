import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Recommend from '@/views/Recommend.vue'
import Hot from '@/views/Hot.vue'
import Categories from '@/views/Categories.vue'
import Care from '@/views/Care.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/hot',
    name: 'hot',
    component: Hot
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories
  },
  {
    path: '/care',
    name: 'care',
    component: Care
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router