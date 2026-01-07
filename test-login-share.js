// 测试登录和创建分享的完整流程
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// 登录测试
async function testLogin() {
  console.log('开始登录测试...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      phone: '13800138000',
      password: '123456'
    });
    
    console.log('登录成功!');
    console.log('响应数据:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('登录失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else if (error.request) {
      console.error('请求已发送但未收到响应:', error.request);
    } else {
      console.error('请求设置错误:', error.message);
    }
    throw error;
  }
}

// 创建分享测试
async function testCreateShare(token) {
  console.log('\n开始创建分享测试...');
  try {
    const response = await axios.post(`${BASE_URL}/api/shares`, {
      musicId: 123456,
      musicTitle: '测试歌曲',
      musicArtist: '测试歌手',
      musicAlbum: '测试专辑',
      musicCover: 'https://via.placeholder.com/120x120',
      content: '这是一个测试分享',
      tags: '测试,音乐',
      privacy: 'public'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('创建分享成功!');
    console.log('响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('创建分享失败:', error.response?.data || error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', error.response.headers);
    }
    throw error;
  }
}

// 测试前端request.js的配置
async function testFrontendRequest() {
  console.log('\n测试前端request.js配置...');
  try {
    // 模拟前端的request对象
    const { default: request } = require('./music-share-frontend/src/api/request.js');
    
    // 模拟localStorage
    global.localStorage = {
      getItem: (key) => key === 'token' ? 'test-token' : null
    };
    
    // 拦截请求，检查配置
    const originalAdapter = request.defaults.adapter;
    request.defaults.adapter = async (config) => {
      console.log('前端请求配置:', config);
      console.log('是否包含Authorization头:', config.headers.Authorization ? '是' : '否');
      if (config.headers.Authorization) {
        console.log('Authorization头内容:', config.headers.Authorization);
      }
      return { data: {}, status: 200 };
    };
    
    await request.post('/shares', { test: 'data' });
    console.log('前端request测试完成');
  } catch (error) {
    console.error('前端request测试失败:', error.message);
  }
}

// 运行测试
async function runTests() {
  try {
    // 测试1: 登录
    const loginData = await testLogin();
    
    // 测试2: 创建分享
    await testCreateShare(loginData.token);
    
    // 测试3: 前端request配置
    // await testFrontendRequest(); // 这个测试可能需要更复杂的环境设置
    
    console.log('\n所有测试完成!');
  } catch (error) {
    console.error('\n测试流程失败:', error.message);
  }
}

runTests();
