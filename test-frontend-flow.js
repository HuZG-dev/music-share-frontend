const axios = require('axios');
const fs = require('fs');

// 创建axios实例，模拟前端的请求配置
const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true
});

// 模拟前端的请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = fs.existsSync('./test-token.txt') ? fs.readFileSync('./test-token.txt', 'utf8') : '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('请求配置:', {
      method: config.method,
      url: config.url,
      headers: { Authorization: config.headers.Authorization },
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// 测试登录功能
async function testLogin() {
  console.log('=== 测试登录功能 ===');
  try {
    const response = await request.post('/auth/login', {
      phone: '13812345678',
      password: '123456'
    });
    
    console.log('登录响应:', response.data);
    
    if (response.data.code === 200 && response.data.data.token) {
      // 保存token用于后续请求
      fs.writeFileSync('./test-token.txt', response.data.data.token);
      console.log('登录成功，token已保存');
      return response.data.data.token;
    } else {
      console.error('登录失败:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('登录请求失败:', error.response ? error.response.data : error.message);
    return null;
  }
}

// 测试创建分享功能
async function testCreateShare(token) {
  console.log('\n=== 测试创建分享功能 ===');
  try {
    const shareData = {
      musicId: '123456',
      musicTitle: '测试歌曲',
      musicArtist: '测试歌手',
      musicAlbum: '测试专辑',
      musicCover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
      content: '这是一个测试分享',
      tags: '测试,音乐',
      privacy: 'public'
    };
    
    const response = await request.post('/shares', shareData);
    console.log('创建分享响应:', response.data);
    
    if (response.data.code === 200) {
      console.log('创建分享成功');
      return true;
    } else {
      console.error('创建分享失败:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('创建分享请求失败:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
    return false;
  }
}

// 运行测试
async function runTests() {
  // 先检查后端服务是否启动
  try {
    await axios.get('http://localhost:8080/test', { timeout: 2000 });
    console.log('后端服务已启动');
  } catch (error) {
    console.error('后端服务未启动，请先启动后端服务');
    process.exit(1);
  }
  
  // 测试登录
  const token = await testLogin();
  if (!token) {
    console.error('登录测试失败，无法继续测试');
    process.exit(1);
  }
  
  // 测试创建分享
  await testCreateShare(token);
  
  // 清理测试数据
  fs.unlinkSync('./test-token.txt');
  console.log('\n测试完成，已清理测试数据');
}

runTests();