// 网易云音乐API调用文件
// 使用第三方开源的网易云音乐API：https://binaryify.github.io/NeteaseCloudMusicApi/

import axios from 'axios'

// 创建网易云音乐API实例
const neteaseApi = axios.create({
  baseURL: 'https://autumnfish.cn', // 第三方网易云音乐API地址
  timeout: 10000
})

// 获取推荐歌单
export const getRecommendedPlaylists = async (limit = 6) => {
  try {
    const response = await neteaseApi.get('/personalized', {
      params: {
        limit
      }
    })
    return response.data
  } catch (error) {
    console.error('获取推荐歌单失败:', error)
    throw error
  }
}

// 获取歌单详情
export const getPlaylistDetail = async (id) => {
  try {
    const response = await neteaseApi.get('/playlist/detail', {
      params: {
        id
      }
    })
    return response.data
  } catch (error) {
    console.error('获取歌单详情失败:', error)
    throw error
  }
}

// 获取音乐播放URL
export const getMusicUrl = async (id) => {
  try {
    const response = await neteaseApi.get('/song/url', {
      params: {
        id
      }
    })
    return response.data
  } catch (error) {
    console.error('获取音乐播放URL失败:', error)
    throw error
  }
}

// 获取音乐详情
export const getMusicDetail = async (ids) => {
  try {
    const response = await neteaseApi.get('/song/detail', {
      params: {
        ids
      }
    })
    return response.data
  } catch (error) {
    console.error('获取音乐详情失败:', error)
    throw error
  }
}

// 获取热门音乐
export const getHotSongs = async (limit = 10) => {
  try {
    const response = await neteaseApi.get('/top/song', {
      params: {
        limit
      }
    })
    return response.data
  } catch (error) {
    console.error('获取热门音乐失败:', error)
    throw error
  }
}

// 搜索音乐
export const searchMusic = async (keywords, limit = 10, offset = 0) => {
  try {
    const response = await neteaseApi.get('/search', {
      params: {
        keywords,
        limit,
        offset
      }
    })
    return response.data
  } catch (error) {
    console.error('搜索音乐失败:', error)
    throw error
  }
}
