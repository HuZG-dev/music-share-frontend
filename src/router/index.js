import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Recommend from '@/views/Recommend.vue'
import Hot from '@/views/Hot.vue'
import Categories from '@/views/Categories.vue'
import Care from '@/views/Care.vue'
import UserProfile from '@/views/UserProfile.vue'
import CreateShare from '@/views/CreateShare.vue'
import ManageShare from '@/views/ManageShare.vue'
import Settings from '@/views/Settings.vue'

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
    component: Care,
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'profile',
    component: UserProfile
  },
  {
    path: '/create-share',
    name: 'create-share',
    component: CreateShare,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-share',
    name: 'manage-share',
    component: ManageShare,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/settings',
    name: 'settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否登录
    const token = localStorage.getItem('token')
    
    if (!token) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 登录后跳回原页面
      })
    } else {
      next() // 已登录，继续访问
    }
  } else {
    next() // 不需要登录的页面，直接访问
  }
})

export default router