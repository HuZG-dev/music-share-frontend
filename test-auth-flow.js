// 测试登录和分享创建流程的脚本
const axios = require('axios');

// 测试配置
const config = {
  baseURL: 'http://localhost:8080',
  loginData: {
    phone: '13812345678',  // 默认测试用户手机号
    password: '123456'     // 默认测试用户密码
  },
  shareData: {
    musicId: '123456',
    musicTitle: '测试歌曲',
    musicArtist: '测试歌手',
    musicAlbum: '测试专辑',
    musicCover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
    content: '这是一个测试分享',
    tags: '测试,音乐',
    privacy: 'public'
  }
};

// 创建axios实例
const apiClient = axios.create({
  baseURL: config.baseURL,
  withCredentials: true
});

// 记录请求和响应的日志
apiClient.interceptors.request.use(config => {
  console.log('\n=== 请求 ===');
  console.log('URL:', config.url);
  console.log('Method:', config.method);
  console.log('Headers:', config.headers);
  console.log('Data:', config.data);
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  console.log('\n=== 响应 ===');
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  console.log('Data:', response.data);
  return response;
}, error => {
  console.log('\n=== 错误响应 ===');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Headers:', error.response.headers);
    console.log('Data:', error.response.data);
  } else if (error.request) {
    console.log('Request:', error.request);
  } else {
    console.log('Error:', error.message);
  }
  return Promise.reject(error);
});

// 测试函数
async function testAuthFlow() {
  console.log('开始测试认证和分享创建流程...');
  
  try {
    // 步骤1：登录
    console.log('\n\n1. 测试登录...');
    const loginResponse = await apiClient.post('/api/auth/login', config.loginData);
    
    if (loginResponse.status === 200 && loginResponse.data.code === 200) {
      console.log('✅ 登录成功');
      const token = loginResponse.data.data?.token;
      
      if (!token) {
        console.error('❌ 登录响应中没有找到token');
        return;
      }
      
      console.log('获取到的token:', token);
      
      // 添加Authorization头
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 步骤2：测试认证状态
      console.log('\n\n2. 测试认证状态...');
      await apiClient.get('/api/auth/check-status');
      console.log('✅ 认证状态检查成功');
      
      // 步骤3：创建分享
      console.log('\n\n3. 测试创建分享...');
      const shareResponse = await apiClient.post('/api/shares', config.shareData);
      
      if (shareResponse.status === 200 && shareResponse.data.code === 200) {
        console.log('✅ 分享创建成功');
        console.log('创建的分享:', shareResponse.data.data);
      } else {
        console.error('❌ 分享创建失败，状态码:', shareResponse.status, '消息:', shareResponse.data.message);
      }
      
    } else {
      console.error('❌ 登录失败，状态码:', loginResponse.status, '消息:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.error('\n\n❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testAuthFlow();