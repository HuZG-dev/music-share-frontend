import request from './request'

// 获取轮播图列表
export const getBanners = () => {
  return request({
    url: '/banners',
    method: 'get'
  })
}

// 创建轮播图
export const createBanner = (data) => {
  return request({
    url: '/banners',
    method: 'post',
    data
  })
}

// 更新轮播图
export const updateBanner = (id, data) => {
  return request({
    url: `/banners/${id}`,
    method: 'put',
    data
  })
}

// 删除轮播图
export const deleteBanner = (id) => {
  return request({
    url: `/banners/${id}`,
    method: 'delete'
  })
}
