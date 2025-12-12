// 网易云音乐API调用文件
// 使用第三方开源的网易云音乐API：https://api.injahow.cn/meting/

import axios from 'axios'

// 创建网易云音乐API实例
const neteaseApi = axios.create({
  baseURL: 'https://api.injahow.cn/meting/', // 第三方网易云音乐API地址
  timeout: 10000
})

// 格式化响应数据
const formatMusicData = (music) => {
  return {
    id: music.id,
    name: music.name,
    artist: music.artist,
    album: music.album,
    url: music.url,
    pic: music.pic,
    lrc: music.lrc
  }
}

// 批量格式化音乐数据
const formatMusicList = (musicList) => {
  if (!Array.isArray(musicList)) return []
  return musicList.map(formatMusicData)
}

// 模拟数据
const mockMusicList = [
  {
    id: '1842728629',
    name: '如果呢',
    artist: '郑润泽',
    album: '如果呢',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  },
  {
    id: '1838868183',
    name: '解药',
    artist: '告五人',
    album: '带你飞',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  },
  {
    id: '1839237849',
    name: '凄美地',
    artist: '郭顶',
    album: '飞行器的执行周期',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  },
  {
    id: '1837654283',
    name: '笼',
    artist: '张碧晨',
    album: '笼',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  },
  {
    id: '1836723845',
    name: '奢香夫人',
    artist: '凤凰传奇',
    album: '最炫民族风',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  },
  {
    id: '1835428937',
    name: '海底',
    artist: '一支榴莲',
    album: '海底',
    url: '',
    pic: '/src/assets/default-music-cover.png',
    lrc: ''
  }
]

// 获取推荐歌单
export const getRecommendedPlaylists = async (limit = 6) => {
  try {
    // 使用云音乐官方精选歌单ID
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'playlist',
        id: '3778678', // 云音乐热歌榜
        limit
      }
    })
    const data = formatMusicList(response.data)
    // 如果API返回数据为空，使用模拟数据
    return data.length > 0 ? data : mockMusicList.slice(0, limit)
  } catch (error) {
    console.error('获取推荐歌单失败，使用模拟数据:', error)
    // API调用失败时返回模拟数据
    return mockMusicList.slice(0, limit)
  }
}

// 获取歌单详情
export const getPlaylistDetail = async (id, limit = 10) => {
  try {
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'playlist',
        id,
        limit
      }
    })
    const data = formatMusicList(response.data)
    return data.length > 0 ? data : mockMusicList.slice(0, limit)
  } catch (error) {
    console.error('获取歌单详情失败，使用模拟数据:', error)
    return mockMusicList.slice(0, limit)
  }
}

// 获取音乐播放URL
export const getMusicUrl = async (id) => {
  try {
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'url',
        id
      }
    })
    // URL接口可能返回单个对象或数组
    if (Array.isArray(response.data)) {
      return response.data.length > 0 ? formatMusicData(response.data[0]) : null
    }
    return formatMusicData(response.data)
  } catch (error) {
    console.error('获取音乐播放URL失败:', error)
    // URL获取失败时返回空URL
    return {
      id,
      name: '',
      artist: '',
      album: '',
      url: '',
      pic: '/src/assets/default-music-cover.png',
      lrc: ''
    }
  }
}

// 获取音乐详情
export const getMusicDetail = async (id) => {
  try {
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'song',
        id
      }
    })
    // 歌曲详情接口可能返回单个对象或数组
    if (Array.isArray(response.data)) {
      return response.data.length > 0 ? formatMusicData(response.data[0]) : null
    }
    return formatMusicData(response.data)
  } catch (error) {
    console.error('获取音乐详情失败:', error)
    // 查找模拟数据中匹配的歌曲
    return mockMusicList.find(music => music.id === id) || null
  }
}

// 获取热门音乐
export const getHotSongs = async (limit = 10) => {
  try {
    // 使用云音乐飙升榜
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'playlist',
        id: '19723756', // 云音乐飙升榜
        limit
      }
    })
    const data = formatMusicList(response.data)
    return data.length > 0 ? data : mockMusicList.slice(0, limit)
  } catch (error) {
    console.error('获取热门音乐失败，使用模拟数据:', error)
    return mockMusicList.slice(0, limit)
  }
}

// 搜索音乐
export const searchMusic = async (keywords, limit = 10) => {
  try {
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'search',
        id: keywords,
        limit
      }
    })
    const data = formatMusicList(response.data)
    return data.length > 0 ? data : []
  } catch (error) {
    console.error('搜索音乐失败:', error)
    return []
  }
}
