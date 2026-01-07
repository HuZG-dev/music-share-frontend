const axios = require('axios');

// 后端API地址
const API_BASE_URL = 'http://localhost:8080/api';

// 测试账号信息
const testUser = {
  phone: '13800138000',
  password: '123456'
};

async function testTokenFlow() {
  try {
    console.log('=== 测试JWT Token流程开始 ===');
    
    // 1. 测试登录获取token
    console.log('\n1. 测试登录获取token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('登录响应:', loginResponse.data);
    
    if (!loginResponse.data.data || !loginResponse.data.data.token) {
      console.error('登录失败：未获取到token');
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('获取到的token:', token);
    
    // 2. 测试使用token创建分享
    console.log('\n2. 测试使用token创建分享...');
    const shareData = {
      musicId: '123456',
      musicTitle: '测试歌曲',
      musicArtist: '测试歌手',
      musicAlbum: '测试专辑',
      musicCover: 'https://example.com/cover.jpg',
      content: '测试分享内容',
      tags: '测试,音乐',
      privacy: 0
    };
    
    const shareResponse = await axios.post(`${API_BASE_URL}/shares`, shareData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
    
    console.log('创建分享响应:', shareResponse.data);
    console.log('分享创建成功！');
    
    // 3. 测试使用无效token创建分享
    console.log('\n3. 测试使用无效token创建分享...');
    try {
      const invalidToken = 'invalid.token.here';
      const invalidShareResponse = await axios.post(`${API_BASE_URL}/shares`, shareData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${invalidToken}`
        },
        withCredentials: true
      });
      console.log('无效token测试响应:', invalidShareResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('无效token测试预期失败:', error.response.status, error.response.data);
      } else {
        console.log('无效token测试失败:', error.message);
      }
    }
    
    // 4. 测试不提供token创建分享
    console.log('\n4. 测试不提供token创建分享...');
    try {
      const noTokenShareResponse = await axios.post(`${API_BASE_URL}/shares`, shareData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('无token测试响应:', noTokenShareResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('无token测试预期失败:', error.response.status, error.response.data);
      } else {
        console.log('无token测试失败:', error.message);
      }
    }
    
    console.log('\n=== 测试JWT Token流程结束 ===');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.status, error.response.data);
    }
  }
}

// 执行测试
testTokenFlow();
