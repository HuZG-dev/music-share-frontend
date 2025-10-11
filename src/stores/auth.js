// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const isLoggedIn = ref(false)
  const userInfo = ref(null)
  const token = ref('')

  // Getter
  const getUserName = computed(() => userInfo.value?.name || '')
  const isAuthenticated = computed(() => isLoggedIn.value && token.value)

  // Actions
  const login = async (loginData) => {
    try {
      // 模拟登录 API 调用
      // const response = await api.post('/login', loginData)
      
      // 模拟成功响应
      const userData = {
        id: 1,
        name: loginData.username,
        email: `${loginData.username}@example.com`
      }
      const authToken = 'pinia-token-' + Date.now()

      // 更新状态
      isLoggedIn.value = true
      userInfo.value = userData
      token.value = authToken

      // 持久化存储
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('userInfo', JSON.stringify(userData))

      return Promise.resolve(userData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = null
    token.value = ''
    
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('authToken')
    const storedUserInfo = localStorage.getItem('userInfo')
    
    if (storedToken && storedUserInfo) {
      isLoggedIn.value = true
      token.value = storedToken
      userInfo.value = JSON.parse(storedUserInfo)
    }
  }

  // 初始化时检查登录状态
  checkAuth()

  return {
    // State
    isLoggedIn,
    userInfo,
    token,
    
    // Getters
    getUserName,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    checkAuth
  }
})