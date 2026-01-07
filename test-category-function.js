const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:8080/api';
const FRONTEND_URL = 'http://localhost:5173';

// 测试用户信息
const TEST_USER = {
  phone: '13800138005',
  password: 'password123',
  nickname: '测试用户'
};

// 测试音乐信息
const TEST_MUSIC = {
  id: '167876',
  title: '晴天',
  artist: '周杰伦',
  album: '叶惠美',
  cover: 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg'
};

// 测试分类
const TEST_CATEGORY = '流行';

// 测试分享内容
const TEST_CONTENT = '这是一首经典的歌曲，非常喜欢！';

async function testCategoryFunction() {
  console.log('=== 测试分类选择功能 ===\n');
  
  try {
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 1. 注册用户
    console.log('1. 注册用户...');
    try {
      await axiosInstance.post('/auth/register', {
        phone: TEST_USER.phone,
        password: TEST_USER.password,
        nickname: TEST_USER.nickname
      });
      console.log('✅ 用户注册成功\n');
    } catch (registerError) {
      if (registerError.response?.data?.message?.includes('已注册')) {
        console.log('⚠️ 用户已存在，跳过注册\n');
      } else {
        throw registerError;
      }
    }
    
    // 2. 用户登录
    console.log('2. 用户登录...');
    const loginResponse = await axiosInstance.post('/auth/login', {
      phone: TEST_USER.phone,
      password: TEST_USER.password
    });
    
    if (loginResponse.data.code !== 200) {
      throw new Error('登录失败：' + loginResponse.data.message);
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，获取到Token\n');
    
    // 3. 设置请求头，携带Token
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 4. 创建分享并选择分类
    console.log('3. 创建分享并选择分类...');
    console.log(`   分类：${TEST_CATEGORY}`);
    
    const shareData = {
      musicId: TEST_MUSIC.id,
      musicTitle: TEST_MUSIC.title,
      musicArtist: TEST_MUSIC.artist,
      musicAlbum: TEST_MUSIC.album,
      musicCover: TEST_MUSIC.cover,
      content: TEST_CONTENT,
      musicCategory: TEST_CATEGORY,
      privacy: 'public'
    };
    
    const createResponse = await axiosInstance.post('/shares', shareData);
    
    if (createResponse.data.code !== 200) {
      throw new Error('创建分享失败：' + createResponse.data.message);
    }
    
    const shareId = createResponse.data.data.id;
    console.log(`✅ 分享创建成功，ID：${shareId}\n`);
    
    // 5. 验证分享分类是否正确保存
    console.log('4. 验证分享分类是否正确保存...');
    const getShareResponse = await axiosInstance.get(`/shares/${shareId}`);
    
    if (getShareResponse.data.code !== 200) {
      throw new Error('获取分享失败：' + getShareResponse.data.message);
    }
    
    const share = getShareResponse.data.data;
    console.log(`   分享标题：${share.musicTitle}`);
    console.log(`   保存的分类：${share.musicCategory}`);
    
    if (share.musicCategory === TEST_CATEGORY) {
      console.log('✅ 分类保存正确\n');
    } else {
      throw new Error(`分类保存错误，预期：${TEST_CATEGORY}，实际：${share.musicCategory}`);
    }
    
    console.log('=== 测试完成！分类选择功能正常工作 ===');
    console.log(`\n分享链接：${FRONTEND_URL}/share/${shareId}`);
    
  } catch (error) {
    console.error('❌ 测试失败：');
    if (error.response) {
      console.error('状态码：', error.response.status);
      console.error('响应数据：', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但未收到响应：', error.request);
    } else {
      console.error('请求设置错误：', error.message);
    }
    process.exit(1);
  }
}

// 运行测试
testCategoryFunction();
