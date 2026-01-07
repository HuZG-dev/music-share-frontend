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
    console.log('搜索分享，关键词:', keyword);
    const response = await request.get('/shares/search', {
      params: {
        keyword
      }
    });
    console.log('搜索分享响应:', response);
    // 后端返回的数据格式是 Result<List<Share>>，实际数据在 data 字段中
    const shares = response.data || [];
    console.log('搜索到的分享数量:', shares.length);
    return shares;
  } catch (error) {
    console.error('搜索分享失败:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
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
    const response = await request.post(`/shares/delete/${id}`)
    return response
  } catch (error) {
    console.error('删除分享失败:', error)
    throw error
  }
}

// 更新分享
export const updateShare = async (id, shareData) => {
  try {
    const response = await request.put(`/shares/${id}`, shareData)
    return response.data
  } catch (error) {
    console.error('更新分享失败:', error)
    throw error
  }
}

// ===== 评论相关API =====

// 创建评论
export const createComment = async (shareId, content, parentId = null) => {
  const response = await request.post('/comments', {
    shareId,
    content,
    parentId
  })
  return response.data
}

// 获取分享的评论列表
export const getComments = async (shareId) => {
  const response = await request.get(`/comments/share/${shareId}`)
  return response.data
}

// 删除评论
export const deleteComment = async (commentId) => {
  const response = await request.delete(`/comments/${commentId}`)
  return response.data
}

// 获取评论数量
export const getCommentCount = async (shareId) => {
  const response = await request.get(`/comments/count/${shareId}`)
  return response.data
}

// ===== 点赞相关API =====

// 点赞分享
export const likeShare = async (shareId) => {
  const response = await request.post(`/likes/${shareId}`)
  return response
}

// 取消点赞
export const unlikeShare = async (shareId) => {
  const response = await request.delete(`/likes/${shareId}`)
  return response
}

// 检查点赞状态
export const checkLikeStatus = async (shareId) => {
  const response = await request.get(`/likes/check/${shareId}`)
  return response.data // Result.success(boolean) 的 data 字段
}

// 获取用户点赞的所有分享
export const getUserLikedShares = async () => {
  const response = await request.get('/likes/user')
  return response.data // Result.success(List<Share>) 的 data 字段
}

// ===== 收藏相关API =====

// 收藏分享
export const collectShare = async (shareId) => {
  const response = await request.post(`/collections/${shareId}`)
  return response
}

// 取消收藏
export const uncollectShare = async (shareId) => {
  const response = await request.delete(`/collections/${shareId}`)
  return response
}

// 检查收藏状态
export const checkCollectionStatus = async (shareId) => {
  const response = await request.get(`/collections/check/${shareId}`)
  return response.data
}

// 获取用户收藏的所有分享
export const getUserCollectedShares = async () => {
  const response = await request.get('/collections/user')
  return response.data
}

// ===== 关注相关API =====

// 关注用户
export const followUser = async (userId) => {
  const response = await request.post(`/follows/${userId}`)
  return response
}

// 取消关注
export const unfollowUser = async (userId) => {
  const response = await request.delete(`/follows/${userId}`)
  return response
}

// 检查关注状态
export const checkFollowStatus = async (userId) => {
  const response = await request.get(`/follows/check/${userId}`)
  return response.data
}

// 获取关注列表
export const getFollowings = async () => {
  const response = await request.get('/follows/followings')
  return response.data
}

// 获取粉丝列表
export const getFollowers = async () => {
  const response = await request.get('/follows/followers')
  return response.data
}

// 获取关注数
export const getFollowingCount = async (userId) => {
  const response = await request.get(`/follows/count/following/${userId}`)
  return response.data
}

// 获取粉丝数
export const getFollowerCount = async (userId) => {
  const response = await request.get(`/follows/count/follower/${userId}`)
  return response.data
}

// 搜索用户
export const searchUsers = async (keyword) => {
  const response = await request.get('/user/search', { params: { keyword } })
  return response.data
}

// 获取用户信息
export const getUserInfo = async (userId) => {
  const response = await request.get(`/user/${userId}`)
  return response.data
}

// 获取用户的分享列表
export const getUserShares = async (userId) => {
  const response = await request.get(`/shares/user/${userId}`)
  return response.data
}

// 获取用户的关注列表
export const getUserFollowings = async (userId) => {
  const response = await request.get(`/follows/followings/${userId}`)
  return response.data
}

// 获取用户的粉丝列表
export const getUserFollowers = async (userId) => {
  const response = await request.get(`/follows/followers/${userId}`)
  return response.data
}

// 获取热门用户（粉丝数最多的用户）
export const getTopUsers = async (limit = 5) => {
  const response = await request.get('/user/top', { params: { limit } })
  return response.data
}