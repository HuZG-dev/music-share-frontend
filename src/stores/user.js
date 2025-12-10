import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value.nickname)
  const userAvatar = computed(() => userInfo.value.avatar)

  const login = (userData, userToken) => {
    token.value = userToken
    userInfo.value = userData
    localStorage.setItem('token', userToken)
    localStorage.setItem('userInfo', JSON.stringify(userData))
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('loginStatusChange'))
  }

  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('loginStatusChange'))
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userName,
    userAvatar,
    login,
    logout
  }
})