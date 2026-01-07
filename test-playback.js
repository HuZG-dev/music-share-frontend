// 测试播放功能的脚本
const axios = require('axios');

// 测试获取音乐URL
async function testMusicUrl() {
  console.log('测试获取音乐URL...');
  try {
    const response = await axios.get('https://api.injahow.cn/meting/', {
      params: {
        server: 'netease',
        type: 'song',
        id: '1388928463' // 从后端获取的一个musicId
      }
    });
    
    console.log('API响应:', response.data);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      const songData = response.data[0];
      if (songData && songData.url) {
        console.log('成功获取到音乐URL:', songData.url);
        return songData.url;
      }
    }
    
    console.log('未获取到有效音乐URL');
    return null;
  } catch (error) {
    console.error('获取音乐URL失败:', error.message);
    return null;
  }
}

// 测试音频URL是否返回有效的MP3数据
async function testAudioStream(url) {
  console.log('\n测试音频流...');
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    
    console.log('音频请求状态:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    
    // 验证是否为MP3格式（检查ID3头）
    const isMp3 = Buffer.isBuffer(response.data) && 
                  response.data.length >= 3 && 
                  response.data[0] === 0x49 && 
                  response.data[1] === 0x44 && 
                  response.data[2] === 0x33;
    
    console.log('是否为MP3格式:', isMp3);
    
    if (isMp3) {
      console.log('音频流验证成功: 有效MP3文件');
      return true;
    } else {
      console.log('音频流验证失败: 不是有效MP3文件');
      return false;
    }
  } catch (error) {
    console.error('测试音频流失败:', error.message);
    return false;
  }
}

// 测试音频播放流程
async function testPlayback() {
  const url = await testMusicUrl();
  if (url) {
    console.log('\n测试播放功能:');
    console.log('音频URL:', url);
    await testAudioStream(url);
    console.log('在浏览器中，这个URL可以直接用于音频元素的src属性进行播放');
    console.log('前端Player组件会自动处理播放逻辑');
  } else {
    console.log('\n无法测试播放功能，因为未获取到有效音乐URL');
  }
}

// 运行测试
testPlayback().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试过程中发生错误:', error);
});
