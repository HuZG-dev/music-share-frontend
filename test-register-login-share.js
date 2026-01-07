const axios = require('axios');

// 配置
const config = {
  baseURL: 'http://localhost:8080/api',
  registerData: {
    phone: '13800138000',
    nickname: 'testuser',
    password: 'testpassword123'
  },
  loginData: {
    phone: '13800138000',
    password: 'testpassword123'
  },
  shareData: {
    musicId: '123456',
    musicTitle: '测试歌曲',
    musicArtist: '测试歌手',
    musicAlbum: '测试专辑',
    musicCover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
    content: '这是一个测试分享内容',
    tags: '测试,音乐',
    privacy: 'public'
  }
};

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 注册用户
async function registerUser() {
  console.log('\n步骤1: 用户注册');
  try {
    const response = await axiosInstance.post('/auth/register', config.registerData);
    console.log('✓ 注册成功');
    console.log('注册响应:', response.data);
    return response.data;
  } catch (error) {
    console.error('✗ 注册失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    // 注册失败可能是因为用户已存在，继续执行登录
    return null;
  }
}

// 登录获取token
async function login() {
  console.log('\n步骤2: 用户登录');
  try {
    const response = await axiosInstance.post('/auth/login', config.loginData);
    console.log('✓ 登录成功');
    console.log('登录响应:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('✗ 登录失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    throw error;
  }
}

// 创建分享
async function createShare(token) {
  console.log('\n步骤3: 创建分享');
  try {
    const response = await axiosInstance.post('/shares', config.shareData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✓ createShare API调用成功');
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('✗ 创建分享失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    }
    throw error;
  }
}

// 主测试函数
async function runTests() {
  console.log('===== 开始完整流程测试 =====');
  
  try {
    // 1. 注册用户（如果用户已存在则跳过）
    await registerUser();
    
    // 2. 登录获取token
    const token = await login();
    
    // 3. 使用获取的token创建分享
    await createShare(token);
    
    console.log('\n✅ 所有测试通过！分享创建功能已修复！');
  } catch (error) {
    console.log('\n❌ 测试失败！');
    process.exit(1);
  }
}

// 运行测试
runTests();
