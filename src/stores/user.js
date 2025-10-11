// src/stores/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      userInfo.value = response.data
      localStorage.setItem('userInfo', JSON.stringify(response.data))
    } catch (error) {
      clearUserInfo()
      throw error
    }
  }

  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    clearUserInfo,
    fetchUserInfo
  }
})