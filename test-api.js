const axios = require('axios');

// 测试获取分享详情API
async function testShareDetailApi() {
  console.log('测试获取分享详情API...');
  
  const shareId = '123';
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzgxMjM0NTY3OCIsInVzZXJJZCI6MSwicGhvbmUiOiIxMzgxMjM0NTY3OCIsImlhdCI6MTc2NTcyMDkxMiwiZXhwIjoxNzY1ODA3MzEyfQ.93GY7rNjOXNqlP3Y8Z79AIMC1EASV2DKvFXWDyErxlA';
  
  try {
    const response = await axios.get(`http://localhost:8080/api/shares/${shareId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API响应状态:', response.status);
    console.log('API响应数据:', response.data);
    return response.data;
  } catch (error) {
    console.error('API调用失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else if (error.request) {
      console.error('请求发送但未收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
    return null;
  }
}

// 运行测试
testShareDetailApi().then(() => {
  console.log('\n测试完成');
}).catch(error => {
  console.error('测试过程中发生错误:', error);
});
