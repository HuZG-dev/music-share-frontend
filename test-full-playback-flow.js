// 测试完整的音乐播放流程
const axios = require('axios');

// 配置
const BASE_URL = 'http://localhost:8080/api';
const TEST_SHARE_ID = '1'; // 假设分享ID为1

// 测试用户信息
const TEST_USER = {
  phone: '13812345678',
  password: '123456'
};

// 测试播放功能的完整流程
async function testFullPlaybackFlow() {
  try {
    console.log('===== 开始测试完整音乐播放流程 =====');
    
    // 0. 登录获取认证令牌
    console.log('0. 登录获取认证令牌...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    console.log('登录响应完整结构:', JSON.stringify(loginResponse.data, null, 2));
    
    // 获取令牌，可能在不同的字段中
    let token = loginResponse.data.token || loginResponse.data.data?.token || loginResponse.data.access_token;
    console.log('提取到的令牌:', token);
    
    if (!token) {
      console.error('❌ 登录成功但未获取到令牌');
      return false;
    }
    
    // 1. 获取所有分享列表
    console.log('\n1. 获取所有分享列表...');
    const sharesResponse = await axios.get(`${BASE_URL}/shares`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('获取到的分享列表:', JSON.stringify(sharesResponse.data, null, 2));
    
    // 检查分享列表是否有数据
    if (!sharesResponse.data.data || sharesResponse.data.data.length === 0) {
      console.error('❌ 没有找到任何分享记录');
      return false;
    }
    
    // 选择第一个分享
    const firstShare = sharesResponse.data.data[0];
    const shareId = firstShare.id;
    const musicId = firstShare.musicId;
    
    console.log('\n2. 选择分享ID:', shareId, '进行测试');
    console.log('分享的musicId:', musicId);
    
    if (!musicId) {
      console.error('分享详情中没有musicId');
      return false;
    }
    
    // 3. 获取音乐URL
    console.log('\n3. 获取音乐URL，musicId:', musicId);
    const musicResponse = await axios.get('https://api.injahow.cn/meting/', {
      params: {
        server: 'netease',
        type: 'song',
        id: musicId
      }
    });
    
    console.log('获取到的音乐数据:', JSON.stringify(musicResponse.data, null, 2));
    
    if (Array.isArray(musicResponse.data) && musicResponse.data.length > 0) {
      const songData = musicResponse.data[0];
      if (songData && songData.url) {
        console.log('\n✅ 成功获取到音乐URL:', songData.url);
        
        // 4. 测试音乐URL的有效性
        console.log('\n4. 测试音乐URL的有效性...');
        try {
          const urlResponse = await axios.head(songData.url, {
            timeout: 5000
          });
          console.log('✅ 音乐URL有效，响应状态:', urlResponse.status);
          console.log('内容类型:', urlResponse.headers['content-type']);
          console.log('内容长度:', urlResponse.headers['content-length']);
          
          // 5. 测试音频流
          console.log('\n5. 测试音频流（获取前1KB数据）...');
          const audioResponse = await axios.get(songData.url, {
            timeout: 10000,
            responseType: 'arraybuffer',
            maxRedirects: 5
          });
          
          console.log('✅ 音频流请求成功，响应状态:', audioResponse.status);
          console.log('获取到的音频数据大小:', audioResponse.data.length, 'bytes');
          
          // 6. 验证音频数据格式（检查是否是MP3格式）
          const isMp3 = Buffer.isBuffer(audioResponse.data) && 
                      audioResponse.data.length >= 3 && 
                      audioResponse.data[0] === 0x49 && 
                      audioResponse.data[1] === 0x44 && 
                      audioResponse.data[2] === 0x33;
          
          if (isMp3) {
            console.log('✅ 验证通过：是有效的MP3音频数据');
          } else {
            console.log('⚠️  可能不是MP3格式，但返回了数据');
          }
          
          console.log('\n===== 完整音乐播放流程测试成功！ =====');
          return true;
          
        } catch (err) {
          console.error('❌ 音乐URL请求失败:', err.message);
          return false;
        }
      }
    }
    
    console.error('❌ 未获取到有效音乐URL');
    return false;
    
  } catch (error) {
    console.error('❌ 完整音乐播放流程测试失败:', error.message);
    console.error('错误详情:', error.response ? error.response.data : error);
    return false;
  }
}

// 运行测试
testFullPlaybackFlow();
