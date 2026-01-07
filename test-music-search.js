// 测试网易云音乐搜索API - 增强版，包含封面URL验证
const axios = require('axios');

// 验证封面URL是否有效的函数（与项目中保持一致）
const isValidCoverUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }
  
  try {
    const parsedUrl = new URL(url.trim());
    // 检查协议是否为http或https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // 检查是否包含已知的无效占位符
    const invalidPatterns = [
      'placeholder.com',
      'api/pic/get',
      'default_cover',
      'no_cover',
      'undefined'
    ];
    
    for (const pattern of invalidPatterns) {
      if (url.toLowerCase().includes(pattern)) {
        return false;
      }
    }
    
    // 检查是否包含常见的图片文件扩展名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const urlLower = url.toLowerCase();
    for (const ext of imageExtensions) {
      if (urlLower.endsWith(ext)) {
        return true;
      }
    }
    
    // 对于没有扩展名的URL，检查是否来自网易云音乐的图片服务器
    if (urlLower.includes('music.126.net') || urlLower.includes('y.qq.com')) {
      return true;
    }
    
    return false;
  } catch (error) {
    // URL解析失败，返回无效
    return false;
  }
};

// 格式化音乐数据，应用封面URL验证
const formatMusicDataWithValidation = (music) => {
  let pic = 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵';
  let isValid = false;
  
  if (!music.pic) {
    console.log(`\n🔍 歌曲ID: ${music.id} | 歌曲名: ${music.name}`);
    console.log(`   ❌ 未提供封面URL`);
  } else {
    isValid = isValidCoverUrl(music.pic);
    if (isValid) {
      pic = music.pic;
      console.log(`\n🔍 歌曲ID: ${music.id} | 歌曲名: ${music.name}`);
      console.log(`   ✅ 封面URL有效: ${music.pic}`);
    } else {
      console.log(`\n🔍 歌曲ID: ${music.id} | 歌曲名: ${music.name}`);
      console.log(`   ❌ 封面URL无效: ${music.pic}`);
      console.log(`   🔄 使用默认封面: ${pic}`);
    }
  }
  
  return {
    ...music,
    pic,
    isCoverValid: isValid
  };
};

async function testSearchMusic() {
  try {
    console.log('🎵 开始测试网易云音乐搜索API...');
    console.log('🔍 搜索关键词: 周杰伦');
    console.log('='.repeat(80));
    
    const response = await axios.get('https://api.injahow.cn/meting/', {
      params: {
        server: 'netease',
        type: 'search',
        s: '周杰伦',
        limit: 10
      }
    });
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log(`\n🎉 搜索成功，共找到 ${response.data.length} 首歌曲`);
      console.log('='.repeat(80));
      
      // 对每个搜索结果应用封面URL验证
      const validatedResults = response.data.map(formatMusicDataWithValidation);
      
      console.log('\n' + '='.repeat(80));
      console.log('📊 验证结果统计:');
      const validCovers = validatedResults.filter(music => music.isCoverValid).length;
      const invalidCovers = validatedResults.filter(music => !music.isCoverValid).length;
      console.log(`✅ 有效封面: ${validCovers} 个`);
      console.log(`❌ 无效封面: ${invalidCovers} 个`);
      console.log('='.repeat(80));
      
      // 输出处理后的最终数据
      console.log('\n💾 处理后的最终数据 (包含有效封面URL):');
      console.log(JSON.stringify(validatedResults, null, 2));
      
    } else {
      console.log('❌ 搜索结果为空');
    }
    
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
  }
}

testSearchMusic();