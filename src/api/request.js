import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端地址
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token和打印请求信息
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('请求URL:', config.url)
    console.log('localStorage中的token:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('已添加Authorization头:', config.headers.Authorization)
    } else {
      console.log('未找到token，请求将不包含Authorization头')
    }
    console.log('请求配置:', config)
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 修改这里
request.interceptors.response.use(
  (response) => {
    // 直接返回后端的数据（已经是 {code, message, data, timestamp} 格式）
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 后端返回的错误
      const message = error.response.data?.message || '请求失败'
      ElMessage.error(message)
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      ElMessage.error('网络错误，请检查连接')
    }
    return Promise.reject(error)
  }
)

export default request