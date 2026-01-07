const axios = require('axios');

// 后端API地址
const API_BASE_URL = 'http://localhost:8080/api';

// 测试账号信息
const testUser = {
  phone: '13800138001',
  password: '123456',
  nickname: '测试用户',
  avatar: 'https://example.com/avatar.jpg'
};

async function testRegisterLogin() {
  try {
    console.log('=== 测试注册和登录流程开始 ===');
    
    // 1. 测试注册
    console.log('\n1. 测试注册...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('注册响应:', registerResponse.data);
    } catch (error) {
      if (error.response) {
        console.log('注册可能已存在:', error.response.status, error.response.data);
      } else {
        throw error;
      }
    }
    
    // 2. 测试登录
    console.log('\n2. 测试登录...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: testUser.phone,
      password: testUser.password
    }, {
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
    
    // 3. 测试token验证
    console.log('\n3. 测试token验证...');
    try {
      const userSharesResponse = await axios.get(`${API_BASE_URL}/shares/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log('获取用户分享响应:', userSharesResponse.data);
      console.log('Token验证成功！');
    } catch (error) {
      console.error('Token验证失败:', error.response.status, error.response.data);
    }
    
    console.log('\n=== 测试注册和登录流程结束 ===');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.status, error.response.data);
    }
  }
}

// 执行测试
testRegisterLogin();
