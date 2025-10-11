import request from './request'

export const userLogin = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export const userRegister = (data) => {
  return request({
    url: '/user/register', 
    method: 'post',
    data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}