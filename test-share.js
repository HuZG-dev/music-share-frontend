const axios = require('axios');

// 配置axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 生成随机手机号用于测试
const randomPhone = '138' + Math.floor(10000000 + Math.random() * 90000000);

// 注册信息
const registerData = {
  phone: randomPhone,
  password: '123456',
  nickname: '测试用户' + Math.floor(Math.random() * 1000)
};

// 登录信息
const loginData = {
  phone: randomPhone,
  password: '123456'
};

// 模拟分享数据，与前端CreateShare.vue中的数据结构一致
const shareData = {
  musicId: '123456',
  musicTitle: '测试歌曲',
  musicArtist: '测试歌手',
  musicAlbum: '测试专辑',
  musicCover: 'https://example.com/cover.jpg',
  content: '测试分享内容',
  tags: '流行,测试',
  privacy: 'public'
};

// 完整测试流程：注册 -> 登录 -> 创建分享
async function testCompleteFlow() {
  try {
    // 1. 注册新用户
    console.log('正在注册新用户...');
    console.log('注册手机号:', registerData.phone);
    
    const registerResponse = await apiClient.post('/auth/register', registerData);
    
    if (registerResponse.data.code !== 200) {
      throw new Error('注册失败: ' + (registerResponse.data.message || '未知错误'));
    }
    
    console.log('注册成功');
    
    // 2. 登录获取token
    console.log('\n正在登录...');
    const loginResponse = await apiClient.post('/auth/login', loginData);
    
    if (loginResponse.data.code !== 200) {
      throw new Error('登录失败: ' + (loginResponse.data.message || '未知错误'));
    }
    
    const token = loginResponse.data.data?.token;
    if (!token) {
      throw new Error('登录响应中没有找到token');
    }
    
    console.log('登录成功，获取到token');
    
    // 设置Authorization头
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 3. 创建分享
    console.log('\n正在创建分享...');
    const shareResponse = await apiClient.post('/shares', shareData);
    
    if (shareResponse.data.code === 200) {
      console.log('分享创建成功:', shareResponse.data);
      console.log('\n测试流程完成，所有步骤都成功执行！');
    } else {
      console.error('分享创建失败:', shareResponse.data.message || '未知错误');
    }
    
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 执行测试
testCompleteFlow();
