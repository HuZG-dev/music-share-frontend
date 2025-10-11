import axios from 'axios'

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

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request