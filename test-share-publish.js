const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置测试常量
const BASE_URL = 'http://localhost:8080/api';
const USER_PHONE = '13812345678'; // 测试用户手机号
const USER_PASSWORD = '123456'; // 测试用户密码

// 测试分享数据
const TEST_SHARE_DATA = {
  musicId: '123456',
  musicTitle: '测试歌曲',
  musicArtist: '测试歌手',
  musicAlbum: '测试专辑',
  musicCover: 'https://via.placeholder.com/300x300/667eea/ffffff?text=🎵',
  content: '这是一首非常好听的测试歌曲，推荐给大家！',
  tags: '测试,推荐,好听',
  privacy: 'public'
};

// 保存日志到文件
function logToFile(message) {
  const logPath = path.join(__dirname, 'test-share-publish.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
  console.log(message);
}

// 清除旧日志
fs.writeFileSync(path.join(__dirname, 'test-share-publish.log'), '');
logToFile('=== 开始测试分享发布流程 ===');

// 步骤1：登录获取token
async function testLogin() {
  logToFile('\n步骤1：登录获取token');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      phone: USER_PHONE,
      password: USER_PASSWORD
    });
    
    logToFile(`登录响应状态: ${response.status}`);
    logToFile(`登录响应数据: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data.code === 200 && response.data.data?.token) {
      const token = response.data.data.token;
      logToFile(`✅ 登录成功，获取到token: ${token}`);
      return token;
    } else {
      logToFile(`❌ 登录失败: ${response.data.message}`);
      throw new Error('登录失败');
    }
  } catch (error) {
    if (error.response) {
      logToFile(`❌ 登录请求失败，响应状态: ${error.response.status}`);
      logToFile(`响应数据: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      logToFile(`❌ 登录请求失败，未收到响应`);
    } else {
      logToFile(`❌ 登录请求失败: ${error.message}`);
    }
    throw error;
  }
}

// 步骤2：使用token创建分享
async function testCreateShare(token) {
  logToFile('\n步骤2：使用token创建分享');
  try {
    const response = await axios.post(`${BASE_URL}/shares`, TEST_SHARE_DATA, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    logToFile(`创建分享响应状态: ${response.status}`);
    logToFile(`创建分享响应数据: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data.code === 200) {
      logToFile(`✅ 分享创建成功！`);
      return response.data.data;
    } else {
      logToFile(`❌ 分享创建失败: ${response.data.message}`);
      throw new Error('分享创建失败');
    }
  } catch (error) {
    if (error.response) {
      logToFile(`❌ 创建分享请求失败，响应状态: ${error.response.status}`);
      logToFile(`响应数据: ${JSON.stringify(error.response.data, null, 2)}`);
      logToFile(`响应头: ${JSON.stringify(error.response.headers, null, 2)}`);
    } else if (error.request) {
      logToFile(`❌ 创建分享请求失败，未收到响应`);
    } else {
      logToFile(`❌ 创建分享请求失败: ${error.message}`);
    }
    throw error;
  }
}

// 步骤3：验证分享是否创建成功
async function testVerifyShare(shareId, token) {
  logToFile('\n步骤3：验证分享是否创建成功');
  try {
    const response = await axios.get(`${BASE_URL}/shares/${shareId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logToFile(`获取分享详情响应状态: ${response.status}`);
    logToFile(`获取分享详情响应数据: ${JSON.stringify(response.data, null, 2)}`);
    
    if (response.data.code === 200 && response.data.data?.id === shareId) {
      logToFile(`✅ 分享验证成功，ID: ${shareId}`);
      return response.data.data;
    } else {
      logToFile(`❌ 分享验证失败`);
      throw new Error('分享验证失败');
    }
  } catch (error) {
    if (error.response) {
      logToFile(`❌ 获取分享详情请求失败，响应状态: ${error.response.status}`);
      logToFile(`响应数据: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      logToFile(`❌ 获取分享详情请求失败，未收到响应`);
    } else {
      logToFile(`❌ 获取分享详情请求失败: ${error.message}`);
    }
    throw error;
  }
}

// 主测试函数
async function runTests() {
  try {
    // 步骤1：登录
    const token = await testLogin();
    
    // 步骤2：创建分享
    const share = await testCreateShare(token);
    
    // 步骤3：验证分享
    await testVerifyShare(share.id, token);
    
    logToFile('\n=== 所有测试通过！分享发布流程正常工作 ===');
    
  } catch (error) {
    logToFile(`\n❌ 测试失败: ${error.message}`);
    logToFile('=== 测试结束，存在错误 ===');
    process.exit(1);
  }
}

// 执行测试
runTests();
