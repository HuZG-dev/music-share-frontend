const axios = require('axios');

// 后端API地址
const API_BASE_URL = 'http://localhost:8080/api';

// 测试分享ID（替换为实际创建的分享ID）
const SHARE_ID = 176;

async function verifyShareExists() {
  console.log(`=== 验证分享ID: ${SHARE_ID} 是否存在 ===`);
  
  try {
    // 查询分享详情
    const response = await axios.get(`${API_BASE_URL}/shares/${SHARE_ID}`);
    
    if (response.status === 200 && response.data.code === 200) {
      console.log('✅ 分享存在！');
      console.log('分享详情:');
      console.log(`ID: ${response.data.data.id}`);
      console.log(`音乐标题: ${response.data.data.musicTitle}`);
      console.log(`创建时间: ${response.data.data.createdAt}`);
      console.log('\n=== 验证成功！重启后分享数据未被删除 ===');
    } else {
      console.log('❌ 分享不存在或API返回错误');
      console.log('响应数据:', response.data);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    if (error.response) {
      console.error('错误状态:', error.response.status);
      console.error('错误数据:', error.response.data);
    }
    console.log('\n=== 验证失败！分享数据可能已被删除 ===');
  }
}

// 执行验证
verifyShareExists();
