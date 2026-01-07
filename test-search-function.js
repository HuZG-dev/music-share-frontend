// 测试搜索功能的简单脚本
// 模拟前端搜索功能的测试

// 模拟数据（与netease.js中的mockMusicList相同）
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
];

// 模拟搜索功能（与netease.js中的searchMusic函数相同）
function searchMusic(keyword, limit = 10) {
  try {
    console.log('搜索关键词:', keyword);
    
    // 过滤模拟数据作为搜索结果
    const filteredMockData = mockMusicList.filter(music => 
      music.name.includes(keyword) || 
      music.artist.includes(keyword) || 
      music.album.includes(keyword)
    );
    
    // 如果过滤结果为空，返回完整模拟数据
    return filteredMockData.length > 0 ? filteredMockData.slice(0, limit) : mockMusicList.slice(0, limit);
  } catch (error) {
    console.error('搜索音乐失败:', error);
    // API调用失败时返回模拟数据
    return mockMusicList.slice(0, limit);
  }
}

// 测试用例
console.log('=== 搜索功能测试 ===\n');

// 测试1：搜索存在的歌曲名
console.log('测试1: 搜索歌曲名 "解药"');
const result1 = searchMusic('解药');
console.log('结果:', result1);
console.log('找到', result1.length, '首歌曲\n');

// 测试2：搜索存在的歌手名
console.log('测试2: 搜索歌手名 "张碧晨"');
const result2 = searchMusic('张碧晨');
console.log('结果:', result2);
console.log('找到', result2.length, '首歌曲\n');

// 测试3：搜索存在的专辑名
console.log('测试3: 搜索专辑名 "海底"');
const result3 = searchMusic('海底');
console.log('结果:', result3);
console.log('找到', result3.length, '首歌曲\n');

// 测试4：搜索不存在的关键词
console.log('测试4: 搜索不存在的关键词 "不存在的歌曲"');
const result4 = searchMusic('不存在的歌曲');
console.log('结果:', result4);
console.log('找到', result4.length, '首歌曲\n');

// 测试5：搜索部分关键词
console.log('测试5: 搜索部分关键词 "凄"');
const result5 = searchMusic('凄');
console.log('结果:', result5);
console.log('找到', result5.length, '首歌曲\n');

console.log('=== 测试完成 ===');