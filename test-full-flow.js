const axios = require('axios');

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 测试数据
const testUser = {
  phone: '13800138005',
  password: 'password123'
};

const testShare = {
  content: '测试分享内容',
  musicId: '186016',
  musicTitle: '晴天',
  musicArtist: '周杰伦',
  musicAlbum: '叶惠美',
  musicCover: 'https://p1.music.126.net/W4E4Xn7MZ3qT9Fy4a1dKmA==/109951164364721727.jpg',
  musicCategory: '流行',
  tags: '测试,音乐'
};

async function runTest() {
  console.log('=== 开始完整流程测试 ===\n');
  
  try {
    // 1. 注册用户
    console.log('1. 测试用户注册...');
    const registerResponse = await api.post('/auth/register', testUser);
    console.log('注册响应:', registerResponse.data);
    console.log('注册成功!\n');
  } catch (registerError) {
    if (registerError.response && registerError.response.data.message.includes('已注册')) {
      console.log('用户已存在，跳过注册\n');
    } else {
      console.error('注册失败:', registerError.response ? registerError.response.data : registerError.message);
      return;
    }
  }
  
  // 2. 用户登录
  console.log('2. 测试用户登录...');
  try {
    const loginResponse = await api.post('/auth/login', testUser);
    console.log('登录响应:', loginResponse.data);
    
    if (loginResponse.data.code === 200 && loginResponse.data.data.token) {
      console.log('登录成功! 获得token:', loginResponse.data.data.token);
      const token = loginResponse.data.data.token;
      
      // 3. 使用token创建分享
      console.log('\n3. 使用token创建分享...');
      
      // 添加Authorization头
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const shareResponse = await api.post('/shares', testShare);
      console.log('分享创建响应:', shareResponse.data);
      console.log('\n=== 测试完成 ===');
      
      if (shareResponse.data.code === 200) {
        console.log('✅ 分享创建成功！');
      } else {
        console.log('❌ 分享创建失败:', shareResponse.data.message);
      }
    } else {
      console.error('登录失败:', loginResponse.data.message);
    }
  } catch (loginError) {
    console.error('登录失败:', loginError.response ? loginError.response.data : loginError.message);
  }
}

runTest();
