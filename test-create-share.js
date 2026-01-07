// 测试创建分享的API
const axios = require('axios');

// 配置
const config = {
  baseURL: 'http://localhost:8080/api',
  // 替换成有效的token
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwMCIsInVzZXJJZCI6MSwicGhvbmUiOiIxMjM0NTY3ODkwMCIsImlhdCI6MTcwMjU5NzIxNiwiZXhwIjoxNzAyNjgzNjE2fQ.1qZv3g9gZ6qZv3g9gZ6qZv3g9gZ6qZv3g9gZ6qZv3'
};

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.token) {
      config.headers.Authorization = `Bearer ${config.token}`;
    }
    console.log('请求配置:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 测试数据
const testShareData = {
  musicId: '123456',
  musicTitle: '测试歌曲',
  musicArtist: '测试歌手',
  musicAlbum: '测试专辑',
  musicCover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
  content: '这是一个测试分享内容',
  tags: '测试,音乐',
  privacy: 'public'
};

// 测试步骤
async function runTests() {
  console.log('===== 开始创建分享功能测试 =====\n');
  
  try {
    // 步骤1: 测试createShare API
    console.log('步骤1: 测试createShare API');
    
    // 调用创建分享API
    const response = await axiosInstance.post('/shares', testShareData, {
      token: config.token
    });
    
    console.log('✓ createShare API调用成功');
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
      console.error('响应头:', error.response.headers);
    } else if (error.request) {
      console.error('请求已发送但未收到响应:', error.request);
    } else {
      console.error('请求设置错误:', error.message);
    }
  }
}

// 运行测试
runTests();