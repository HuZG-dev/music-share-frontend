const axios = require('axios');

// 测试获取分享详情API，包含登录获取token
async function testShareDetailWithLogin() {
  console.log('测试登录并获取分享详情API...');
  
  try {
    // 1. 先登录获取token
    console.log('1. 登录获取token...');
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      phone: '13812345678',
      password: '123456'
    });
    
    if (loginResponse.status !== 200 || !loginResponse.data || !loginResponse.data.data || !loginResponse.data.data.token) {
      console.error('登录失败，未获取到token');
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('登录成功，获取到token:', token);
    
    // 2. 使用token获取分享详情
    console.log('\n2. 使用token获取分享详情...');
    const shareId = '123';
    const shareResponse = await axios.get(`http://localhost:8080/api/shares/${shareId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('分享详情API响应状态:', shareResponse.status);
    console.log('分享详情API响应数据:', shareResponse.data);
    
    // 3. 如果分享详情包含musicId，获取音乐URL
    if (shareResponse.data && shareResponse.data.data && shareResponse.data.data.musicId) {
      const musicId = shareResponse.data.data.musicId;
      console.log('\n3. 获取音乐URL，musicId:', musicId);
      
      // 测试获取音乐详情
      try {
        const musicResponse = await axios.get('https://api.injahow.cn/meting/', {
          params: {
            server: 'netease',
            type: 'song',
            id: musicId
          }
        });
        
        console.log('音乐详情API响应状态:', musicResponse.status);
        console.log('音乐详情API响应数据:', musicResponse.data);
        
        if (Array.isArray(musicResponse.data) && musicResponse.data.length > 0) {
          const songData = musicResponse.data[0];
          if (songData && songData.url) {
            console.log('\n获取到有效音乐URL:', songData.url);
            
            // 测试音乐URL是否返回有效的音频流
            console.log('\n4. 测试音乐URL音频流...');
            const audioResponse = await axios.get(songData.url, {
              responseType: 'arraybuffer'
            });
            
            console.log('音频请求状态:', audioResponse.status);
            console.log('Content-Type:', audioResponse.headers['content-type']);
            console.log('Content-Length:', audioResponse.headers['content-length']);
            
            // 验证是否为MP3格式
            const isMp3 = Buffer.isBuffer(audioResponse.data) && 
                          audioResponse.data.length >= 3 && 
                          audioResponse.data[0] === 0x49 && 
                          audioResponse.data[1] === 0x44 && 
                          audioResponse.data[2] === 0x33;
            
            console.log('是否为MP3格式:', isMp3);
          }
        }
      } catch (musicError) {
        console.error('获取音乐详情失败:', musicError.message);
      }
    }
  } catch (error) {
    console.error('测试过程中发生错误:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求发送但未收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
  }
}

// 运行测试
testShareDetailWithLogin().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试过程中发生错误:', error);
});
