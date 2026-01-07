// 测试网易云音乐搜索API的脚本
import axios from 'axios';


// 创建网易云音乐官方搜索API实例
const neteaseSearchApi = axios.create({
  baseURL: 'https://music.163.com/', // 网易云音乐官方API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Referer': 'https://music.163.com/'
  }
});

// 格式化网易云音乐官方搜索API返回的数据
const formatOfficialMusicData = (music) => {
  // 处理歌手信息，将数组转换为字符串
  const artist = music.artists.map(artist => artist.name).join(' / ');
  // 处理专辑封面
  const pic = music.album.picId ? `https://p2.music.126.net/${music.album.picId}.jpg` : '/src/assets/default-music-cover.png';
  
  return {
    id: music.id.toString(),
    name: music.name,
    artist: artist,
    album: music.album.name,
    url: '', // 官方API不直接提供播放URL，需要单独调用获取
    pic: pic,
    lrc: '' // 歌词需要单独调用获取
  };
};

// 批量格式化网易云音乐官方搜索API返回的数据
const formatOfficialMusicList = (musicList) => {
  if (!Array.isArray(musicList)) return [];
  return musicList.map(formatOfficialMusicData);
};

// 测试搜索函数
async function testSearch() {
  const keyword = '周杰伦';
  console.log('开始测试搜索关键词:', keyword);
  
  try {
    // 直接调用网易云音乐官方搜索API
    const response = await neteaseSearchApi.get('api/search/get/web', {
      params: {
        csrf_token: '',
        hlpretag: '',
        hlposttag: '',
        s: keyword,
        type: 1, // 1表示搜索单曲
        offset: 0,
        total: true,
        limit: 10
      }
    });
    
    console.log('API请求成功，响应状态:', response.status);
    console.log('API返回数据:', JSON.stringify(response.data, null, 2));
    
    // 检查API返回状态
    if (response.data.code === 200 && response.data.result && response.data.result.songs) {
      console.log('搜索结果数量:', response.data.result.songs.length);
      // 格式化搜索结果
      const data = formatOfficialMusicList(response.data.result.songs);
      console.log('格式化后的搜索结果:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.error('搜索API返回数据格式异常:', response.data);
      return [];
    }
  } catch (error) {
    console.error('搜索音乐失败:');
    console.error('错误类型:', error.name);
    console.error('错误信息:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.config);
    }
    return [];
  }
}

// 执行测试
testSearch()
  .then(results => {
    console.log('测试完成，共找到', results.length, '首歌曲');
  })
  .catch(error => {
    console.error('测试过程中发生错误:', error);
  });
