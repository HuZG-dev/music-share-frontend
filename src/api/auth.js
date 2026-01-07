// src/api/auth.js
import request from './request'

/**
 * 用户登录（JSON格式）
 * @param {Object} data - 登录数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @returns {Promise} Promise对象
 */
export function authLogin(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @param {string} data.phone - 手机号
 * @param {string} data.password - 密码
 * @param {string} data.nickname - 昵称
 * @returns {Promise} Promise对象
 */
export function authRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param {string} phone - 手机号
 * @returns {Promise} Promise对象
 */
export function getUserInfo(phone) {
  return request({
    url: `/user/info`,
    method: 'get',
    params: { phone }
  })
}

/**
 * 退出登录
 * @returns {Promise} Promise对象
 */
export function authLogout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 发送验证码
 * @param {string} phone - 手机号
 * @returns {Promise} Promise对象
 */
export function sendCaptcha(phone) {
  return request({
    url: '/auth/captcha',
    method: 'post',
    data: { phone }
  })
}

/**
 * 验证验证码
 * @param {Object} data - 验证数据
 * @param {string} data.phone - 手机号
 * @param {string} data.captcha - 验证码
 * @returns {Promise} Promise对象
 */
export function verifyCaptcha(data) {
  return request({
    url: '/auth/verify-captcha',
    method: 'post',
    data
  })
}

/**
 * 检查登录状态
 * @returns {Promise} Promise对象
 */
export function checkAuthStatus() {
  return request({
    url: '/auth/check-status',
    method: 'get'
  })
}

/**
 * 刷新token（如果使用JWT）
 * @param {string} refreshToken - 刷新token
 * @returns {Promise} Promise对象
 */
export function refreshToken(refreshToken) {
  return request({
    url: '/auth/refresh-token',
    method: 'post',
    data: { refreshToken }
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} Promise对象
 */
export function changePassword(data) {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data
  })
}

/**
 * 忘记密码 - 重置
 * @param {Object} data - 重置数据
 * @param {string} data.phone - 手机号
 * @param {string} data.captcha - 验证码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} Promise对象
 */
export function resetPassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data
  })
}

export default {
  authLogin,
  authRegister,
  getUserInfo,
  authLogout,
  sendCaptcha,
  verifyCaptcha,
  checkAuthStatus,
  refreshToken,
  changePassword,
  resetPassword
}