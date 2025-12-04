// src/api/auth.js
import request from './request'

/**
 * 用户登录
 */
export function authLogin(data) {
  return request({
    url: '/auth/login',      // ✅ 正确
    method: 'post',
    data
  })
}

/**
 * 用户注册 - 需要修改路径！
 */
export function authRegister(data) {
  return request({
    url: '/auth/register',   // ❌ 原来是 '/user/register'，需要改为 '/auth/register'
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(phone) {
  return request({
    url: `/user/info`,       // 这个需要后端确认路径
    method: 'get',
    params: { phone }
  })
}

// ... 其他函数