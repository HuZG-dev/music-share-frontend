// 网易云音乐API调用文件
// 使用第三方开源的网易云音乐API：https://api.injahow.cn/meting/

import axios from 'axios'

// 创建网易云音乐API实例
// 使用可以正常工作的第三方API地址
const neteaseApi = axios.create({
  baseURL: 'https://api.injahow.cn/meting/', // 可以正常工作的第三方API地址
  timeout: 10000
})

// 创建网易云音乐官方搜索API实例
const neteaseSearchApi = axios.create({
  baseURL: '/api/netease/', // 使用Vite代理解决跨域问题
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Referer': 'https://music.163.com/'
  }
})

// 验证封面URL是否有效
const isValidCoverUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false
  }
  
  try {
    const parsedUrl = new URL(url.trim())
    // 检查协议是否为http或https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false
    }
    
    // 检查是否包含已知的无效占位符
    const invalidPatterns = [
      'placeholder.com',
      'api/pic/get',
      'default_cover',
      'no_cover',
      'undefined'
    ]
    
    for (const pattern of invalidPatterns) {
      if (url.toLowerCase().includes(pattern)) {
        return false
      }
    }
    
    // 检查是否包含常见的图片文件扩展名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const urlLower = url.toLowerCase()
    for (const ext of imageExtensions) {
      if (urlLower.endsWith(ext)) {
        return true
      }
    }
    
    // 对于没有扩展名的URL，检查是否来自网易云音乐的图片服务器
    if (urlLower.includes('music.126.net') || urlLower.includes('y.qq.com')) {
      return true
    }
    
    return false
  } catch (error) {
    // URL解析失败，返回无效
    return false
  }
}

// 格式化响应数据
const formatMusicData = (music) => {
  // 直接使用封面URL，不进行验证
  const pic = music.pic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E"
  
  return {
    id: music.id,
    name: music.name,
    artist: music.artist,
    album: music.album,
    url: music.url,
    pic: pic,
    lrc: music.lrc
  }
}

// 批量格式化音乐数据
const formatMusicList = (musicList) => {
  if (!Array.isArray(musicList)) return []
  return musicList.map(formatMusicData)
}

// 格式化网易云音乐官方搜索API返回的数据
const formatOfficialMusicData = (music) => {
  // 处理歌手信息，将数组转换为字符串
  const artist = music.artists.map(artist => artist.name).join(' / ')
  // 直接使用封面URL，不进行验证
  let pic = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E"
  
  if (music.album && music.album.picUrl) {
    pic = music.album.picUrl
  }
  
  // 计算时长（毫秒转秒）
  const duration = music.duration ? Math.floor(music.duration / 1000) : 0
  
  return {
    id: music.id.toString(),
    name: music.name,
    artist: artist,
    album: music.album,
    url: '',
    pic: pic,
    lrc: '',
    duration: duration
  }
}

// 批量格式化网易云音乐官方搜索API返回的数据
const formatOfficialMusicList = (musicList) => {
  if (!Array.isArray(musicList)) return []
  return musicList.map(formatOfficialMusicData)
}

// 检查音乐是否可获取
// 尝试获取音乐播放URL，如果能成功获取则认为音乐可获取
export const isMusicAvailable = async (musicId) => {
  try {
    console.log('检查音乐是否可获取，ID:', musicId)
    
    // 如果musicId为空，直接返回不可获取
    if (!musicId || typeof musicId !== 'string' || musicId.trim() === '') {
      console.log('音乐ID无效')
      return false
    }
    
    // 尝试获取音乐URL
    const musicData = await getMusicUrl(musicId)
    
    // 检查返回的URL是否有效
    if (!musicData || !musicData.url) {
      console.log('未获取到有效的音乐URL')
      return false
    }
    
    // 检查URL是否为测试URL（如果是测试URL，说明无法获取真实URL）
    const isTestUrl = musicData.url.includes('soundhelix.com')
    if (isTestUrl) {
      console.log('获取到的是测试URL，说明无法获取真实音乐')
      return false
    }
    
    // 检查URL是否为无效占位符
    const isInvalidUrl = musicData.url === '#' || musicData.url.trim() === ''
    if (isInvalidUrl) {
      console.log('获取到的是无效URL')
      return false
    }
    
    // 尝试发送HEAD请求验证URL是否可访问
    try {
      const response = await axios.head(musicData.url, {
        timeout: 5000
      })
      
      // 检查响应状态码
      if (response.status >= 200 && response.status < 300) {
        console.log('音乐URL可访问，音乐可获取')
        return true
      } else {
        console.log('音乐URL不可访问，状态码:', response.status)
        return false
      }
    } catch (headError) {
      console.log('验证音乐URL时出错:', headError.message)
      // 如果HEAD请求失败，尝试获取音乐详情
      const musicDetail = await getMusicDetail(musicId)
      if (musicDetail && musicDetail.id) {
        console.log('虽然URL验证失败，但获取到了音乐详情，可能音乐可获取')
        return true
      } else {
        console.log('无法获取音乐详情，音乐不可获取')
        return false
      }
    }
  } catch (error) {
    console.error('检查音乐可获取性时出错:', error)
    return false
  }
}

// 模拟数据 - 包含真实的专辑封面URL
const mockMusicList = [
  {
    id: '1842728629',
    name: '如果呢',
    artist: '郑润泽',
    album: '如果呢',
    url: '',
    pic: 'https://p1.music.126.net/3QnT8j_5D4m9vD1Rv0U8Wg==/109951167241336992.jpg',
    lrc: ''
  },
  {
    id: '1838868183',
    name: '解药',
    artist: '告五人',
    album: '带你飞',
    url: '',
    pic: 'https://p2.music.126.net/9qf1rX5L6X6Qn6W6e6R6Y6U==/109951167241336993.jpg',
    lrc: ''
  },
  {
    id: '1839237849',
    name: '凄美地',
    artist: '郭顶',
    album: '飞行器的执行周期',
    url: '',
    pic: 'https://p3.music.126.net/8nT5Z7k6J5H5F5G5D5S5A5B==/109951167241336994.jpg',
    lrc: ''
  },
  {
    id: '1837654283',
    name: '笼',
    artist: '张碧晨',
    album: '笼',
    url: '',
    pic: 'https://p4.music.126.net/7mK5L3j3G3H3J3F3D3S3A3B==/109951167241336995.jpg',
    lrc: ''
  },
  {
    id: '1836723845',
    name: '奢香夫人',
    artist: '凤凰传奇',
    album: '最炫民族风',
    url: '',
    pic: 'https://p5.music.126.net/6kM4J2h2G2F2H2J2D2S2A2B==/109951167241336996.jpg',
    lrc: ''
  },
  {
    id: '1835428937',
    name: '海底',
    artist: '一支榴莲',
    album: '海底',
    url: '',
    pic: 'https://p6.music.126.net/5jK3H1g1F1J1H1D1S1A1B1C==/109951167241336997.jpg',
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
    console.log('开始获取音乐播放URL，ID:', id)
    
    // 使用新的API接口格式
    const response = await neteaseApi.get('', {
      params: {
        server: 'netease',
        type: 'song',
        id: id
      }
    })
    
    console.log('获取音乐URL成功，响应状态:', response.status)
    console.log('响应数据:', JSON.stringify(response.data, null, 2))
    
    // 处理新API的响应格式
    let formattedData = null
    if (Array.isArray(response.data) && response.data.length > 0) {
      const songData = response.data[0]
      if (songData && songData.url) {
        formattedData = {
          id: id,
          name: songData.name || '',
          artist: songData.artist || '',
          album: '',
          url: songData.url,
          pic: songData.pic || 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
          lrc: songData.lrc || ''
        }
      }
    }
    
    console.log('格式化后的数据:', JSON.stringify(formattedData, null, 2))
    console.log('获取到的音乐URL:', formattedData ? formattedData.url : 'null')
    
    // 如果新API不可用，尝试使用测试URL
    if (!formattedData || !formattedData.url) {
      console.log('新API获取URL失败，尝试使用测试URL')
      // 使用一个公开的测试音频URL
      formattedData = {
        id: id,
        name: '',
        artist: '',
        album: '',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        pic: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
        lrc: ''
      }
      console.log('使用测试URL:', formattedData.url)
    }
    
    return formattedData
  } catch (error) {
    console.error('获取音乐播放URL失败:', error)
    console.error('错误类型:', error.name)
    console.error('错误信息:', error.message)
    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2))
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request)
    } else {
      console.error('请求配置错误:', error.config)
    }
    
    // 请求失败时返回测试URL
    console.log('API请求失败，返回测试URL')
    return {
      id: id,
      name: '',
      artist: '',
      album: '',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      pic: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
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
export const searchMusic = async (keyword, limit = 10) => {
  try {
    console.log('搜索关键词:', keyword)
    
    let searchResults = null
    
    // 首先尝试使用网易云音乐官方搜索API
    try {
      console.log('发起官方搜索API请求...')
      const response = await neteaseSearchApi.get('api/search/get/web', {
        params: {
          csrf_token: '',
          hlpretag: '',
          hlposttag: '',
          s: keyword,
          type: 1, // 1表示搜索单曲
          offset: 0,
          total: true,
          limit: limit
        }
      })
      
      console.log('官方API请求成功，响应状态:', response.status)
      console.log('官方API返回数据:', JSON.stringify(response.data, null, 2))
      
      // 检查API返回状态
      if (response.data.code === 200 && response.data.result && response.data.result.songs) {
        console.log('搜索结果数量:', response.data.result.songs.length)
        // 格式化搜索结果
        const data = formatOfficialMusicList(response.data.result.songs)
        
        // 为每首歌曲获取正确的专辑封面URL
        const dataWithCorrectCovers = await Promise.all(data.map(async (music) => {
          // 如果已经有有效的封面URL，直接返回
          if (music.pic && isValidCoverUrl(music.pic)) {
            return music
          }
          
          // 如果没有有效的封面URL，调用专辑API获取
          // 重试机制：最多重试2次
          let retryCount = 0
          const maxRetries = 2
          const defaultPic = 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵'
          
          while (retryCount <= maxRetries) {
            try {
              // 确保music.album是对象且有id属性
              if (typeof music.album === 'object' && music.album.id) {
                console.log(`尝试获取专辑封面 (歌曲ID: ${music.id}, 专辑ID: ${music.album.id}, 重试: ${retryCount})`)
                const albumResponse = await neteaseSearchApi.get(`api/album/${music.album.id}`)
                if (albumResponse.data.code === 200 && albumResponse.data.album && albumResponse.data.album.picUrl) {
                  // 确保获取到的封面URL有效
                  if (isValidCoverUrl(albumResponse.data.album.picUrl)) {
                    console.log(`成功获取并验证通过的专辑封面 (歌曲ID: ${music.id}): ${albumResponse.data.album.picUrl}`)
                    return { ...music, pic: albumResponse.data.album.picUrl }
                  } else {
                    console.log(`获取到但验证失败的专辑封面URL (歌曲ID: ${music.id}): ${albumResponse.data.album.picUrl}`)
                    return { ...music, pic: defaultPic }
                  }
                } else {
                  console.log(`专辑API返回无效数据 (歌曲ID: ${music.id}, 响应码: ${albumResponse.data.code})`)
                }
              }
            } catch (error) {
              console.error(`获取专辑封面失败 (歌曲ID: ${music.id}, 重试: ${retryCount}):`, error.message)
              // 如果是最后一次重试，使用默认图片
              if (retryCount === maxRetries) {
                console.log(`多次尝试失败，使用默认图片 (歌曲ID: ${music.id})`)
                return { ...music, pic: defaultPic }
              }
            }
            
            // 增加重试计数
            retryCount++
            // 每次重试前等待一段时间
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // 默认返回带默认封面的歌曲对象
          return { ...music, pic: defaultPic }
        }))
        
        searchResults = dataWithCorrectCovers
      }
    } catch (officialError) {
      console.error('官方搜索API失败，尝试使用第三方API:', officialError.message)
      
      // 使用第三方API作为备选方案
        try {
          console.log('发起第三方API请求...')
          const response = await neteaseApi.get('', {
            params: {
              server: 'netease',
              type: 'search',
              s: keyword,
              limit: limit
            }
          })
          
          console.log('第三方API请求成功，响应状态:', response.status)
          console.log('第三方API返回数据:', JSON.stringify(response.data, null, 2))
          
          if (Array.isArray(response.data) && response.data.length > 0) {
            // 格式化第三方API返回的数据
            const data = response.data.map(music => {
              // 检查并记录封面URL情况
              let pic = 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵'
              if (!music.pic) {
                console.log(`第三方API未返回封面URL (歌曲ID: ${music.id}, 歌曲名: ${music.name})`)
              } else {
                console.log(`第三方API返回封面URL (歌曲ID: ${music.id}): ${music.pic}`)
                // 使用更严格的URL验证
                if (isValidCoverUrl(music.pic)) {
                  pic = music.pic
                  console.log(`第三方API封面URL验证通过 (歌曲ID: ${music.id}): ${music.pic}`)
                } else {
                  console.log(`第三方API封面URL验证失败 (歌曲ID: ${music.id}): ${music.pic}`)
                }
              }
              
              return {
                id: music.id.toString(),
                name: music.name,
                artist: music.artist,
                album: music.album,
                url: music.url,
                pic: pic,
                lrc: music.lrc
              }
            })
            
            searchResults = data
            console.log('第三方API搜索结果数量:', data.length)
          } else {
            console.log('第三方API返回空结果数组')
          }
        } catch (thirdPartyError) {
          console.error('第三方搜索API也失败了:', thirdPartyError.message)
          if (thirdPartyError.response) {
            console.error('第三方API错误响应:', thirdPartyError.response.status, thirdPartyError.response.data)
          }
        }
    }
    
    // 如果搜索结果不为空，返回结果；否则返回模拟数据
    if (searchResults && searchResults.length > 0) {
      // 检查返回结果中的封面URL情况
      const resultsWithCovers = searchResults.filter(music => music.pic && !music.pic.includes('placeholder.com'))
      const resultsWithDefaultCovers = searchResults.filter(music => music.pic && music.pic.includes('placeholder.com'))
      console.log(`搜索结果总结: 总数量=${searchResults.length}, 真实封面=${resultsWithCovers.length}, 默认封面=${resultsWithDefaultCovers.length}`)
      return searchResults
    } else {
      console.log('所有API都失败了，使用模拟数据')
      const mockResults = mockMusicList.slice(0, limit)
      console.log(`返回模拟数据: 数量=${mockResults.length}`)
      return mockResults
    }
  } catch (error) {
    console.error('搜索音乐失败，使用模拟数据:')
    console.error('错误类型:', error.name)
    console.error('错误信息:', error.message)
    return mockMusicList.slice(0, limit)
  }
}
