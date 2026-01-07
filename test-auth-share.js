// 测试认证和分享创建完整流程
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testShareCreation() {
    console.log('开始测试认证和分享创建流程...');
    
    let token = null;
    
    try {
        // 1. 登录获取token
        console.log('\n1. 尝试登录...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            phone: '13812345678',
            password: '123456'
        });
        
        if (loginResponse.data && loginResponse.data.data) {
            token = loginResponse.data.data.token;
            console.log('✓ 登录成功，获取到token:', token);
        } else {
            console.log('✗ 登录失败:', loginResponse.data);
            return;
        }
        
        // 2. 使用token创建分享
        console.log('\n2. 使用token创建分享...');
        const createResponse = await axios.post(`${BASE_URL}/shares`, {
            musicId: '123',
            musicTitle: '测试音乐',
            musicArtist: '测试歌手',
            musicAlbum: '测试专辑',
            musicCover: 'https://example.com/cover.jpg',
            content: '这是一个测试分享',
            tags: '测试,音乐',
            privacy: false
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✓ 分享创建成功:', createResponse.data);
        console.log('\n🎉 测试完成！认证和分享创建流程正常工作。');
        
    } catch (error) {
        console.log('\n✗ 测试失败:', error.message);
        if (error.response) {
            console.log('响应状态:', error.response.status);
            console.log('响应数据:', error.response.data);
            console.log('响应头:', error.response.headers);
        }
    }
}

testShareCreation();