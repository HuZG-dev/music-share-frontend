import request from './request'

export function userLogin(data) {
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