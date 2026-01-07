// 测试前端request.js的配置
import request from './src/api/request.js';

// 模拟localStorage
global.localStorage = {
  getItem: function(key) {
    if (key === 'token') {
      return 'test-token-123456';
    }
    return null;
  },
  setItem: function(key, value) {},
  removeItem: function(key) {}
};

// 测试POST请求
testPostRequest();

async function testPostRequest() {
  console.log('测试POST请求...');
  try {
    // 拦截Axios的请求，检查是否包含Authorization头
    const originalRequest = request.defaults.adapter;
    
    request.defaults.adapter = async function(config) {
      console.log('请求配置:', config);
      console.log('是否包含Authorization头:', config.headers.Authorization ? '是' : '否');
      if (config.headers.Authorization) {
        console.log('Authorization头内容:', config.headers.Authorization);
      }
      return { data: {}, status: 200 };
    };
    
    await request.post('/shares', { test: 'data' });
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  }
}
