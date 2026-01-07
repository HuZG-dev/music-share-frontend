const axios = require('axios');

// 测试登录API
async function testLoginApi() {
  console.log('测试登录API...');
  
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      phone: '13812345678',
      password: '123456'
    });
    
    console.log('登录成功!');
    console.log('API响应状态:', response.status);
    console.log('API响应数据:', response.data);
    
    if (response.data && response.data.token) {
      console.log('\n新的JWT Token:', response.data.token);
      console.log('有效期:', response.data.expirationTime);
      return response.data.token;
    } else {
      console.log('未获取到有效的token');
      return null;
    }
  } catch (error) {
    console.error('登录失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求发送但未收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
    return null;
  }
}

// 运行测试
testLoginApi().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试过程中发生错误:', error);
});
