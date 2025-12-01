import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端地址
  timeout: 10000
})

// 请求拦截器 - 添加token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
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