const axios = require('axios');

// 后端API地址
const API_BASE_URL = 'http://localhost:8080/api';

// 使用上面测试中获取到的有效token
const validToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzgwMDEzODAwMSIsInVzZXJJZCI6MTcsInBob25lIjoiMTM4MDAxMzgwMDEiLCJpYXQiOjE3NjU2OTkwNDMsImV4cCI6MTc2NTc4NTQ0M30.6653nduPS6t5u-IaXChSHnQDX7IZQQEMeueavRvesJE';

async function testShareCreation() {
  try {
    console.log('=== 测试分享创建功能开始 ===');
    
    // 1. 使用有效token创建分享
    console.log('\n1. 使用有效token创建分享...');
    const shareData = {
      musicId: '123456',
      musicTitle: '测试歌曲',
      musicArtist: '测试歌手',
      musicAlbum: '测试专辑',
      musicCover: 'https://example.com/cover.jpg',
      content: '测试分享内容',
      tags: '测试,音乐',
      privacy: 0
    };
    
    const shareResponse = await axios.post(`${API_BASE_URL}/shares`, shareData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      withCredentials: true
    });
    
    console.log('创建分享响应:', shareResponse.data);
    console.log('分享创建成功！分享ID:', shareResponse.data.data?.id);
    
    // 2. 验证分享是否被正确创建
    if (shareResponse.data.data?.id) {
      console.log('\n2. 验证分享是否被正确创建...');
      const shareId = shareResponse.data.data.id;
      const getShareResponse = await axios.get(`${API_BASE_URL}/shares/${shareId}`, {
        withCredentials: true
      });
      
      console.log('获取分享详情响应:', getShareResponse.data);
      console.log('分享验证成功！');
    }
    
    console.log('\n=== 测试分享创建功能结束 ===');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.status, error.response.data);
    }
  }
}

// 执行测试
testShareCreation();
