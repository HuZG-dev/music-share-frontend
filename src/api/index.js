const API_BASE_URL = 'http://localhost:8080'; // Java Spring Boot默认端口
import request from './request.js';

export const uploadImage = async (file, type = 'covers') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await fetch(`${API_BASE_URL}/api/file/upload`, {
      method: 'POST',
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};

export const fetchHomeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home/data`);
    return await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};

export const fetchAllShares = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shares`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('获取所有分享失败:', error);
    throw error;
  }
};

export const deleteImage = async (filename, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/file/delete/${type}/${filename}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('删除失败:', error);
    throw error;
  }
};

// 获取单个分享详情
export const fetchShareDetail = async (id) => {
  try {
    console.log('fetchShareDetail: 请求参数id =', id);
    const response = await request.get(`/shares/${id}`);
    console.log('fetchShareDetail: API响应 =', response);
    return response;
  } catch (error) {
    console.error('获取分享详情失败:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    throw error;
  }
};

// 搜索分享
export const searchShares = async (keyword) => {
  try {
    const response = await request.get('/shares/search', {
      params: {
        keyword
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('搜索分享失败:', error);
    throw error;
  }
};

// 创建分享
export const createShare = async (shareData) => {
  try {
    const token = localStorage.getItem('token');
    console.log('创建分享请求数据:', shareData);
    console.log('当前token:', token);
    const response = await request.post('/shares', shareData);
    console.log('创建分享响应:', response);
    return response;
  } catch (error) {
    console.error('创建分享失败:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    throw error;
  }
};

// 获取当前用户的分享列表
export const fetchUserShares = async () => {
  try {
    const response = await request.get('/shares/user');
    return response.data || [];
  } catch (error) {
    console.error('获取用户分享失败:', error);
    throw error;
  }
};

// 删除分享
export const deleteShare = async (id) => {
  try {
    const response = await request.post(`/shares/delete/${id}`);
    return response;
  } catch (error) {
    console.error('删除分享失败:', error);
    throw error;
  }
};