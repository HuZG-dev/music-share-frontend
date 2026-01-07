// 完整的分享创建流程测试：登录获取token → 创建分享
const axios = require('axios');
const fs = require('fs');

// 配置
const API_BASE_URL = 'http://localhost:8080';
const LOGIN_PHONE = '13912345678';
const LOGIN_PASSWORD = '123456';

async function testShareCreationFlow() {
    console.log('=== 测试分享创建完整流程开始 ===\n');
    
    let token = '';
    
    try {
        // 1. 登录获取新token
        console.log('1. 正在登录获取token...');
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            phone: LOGIN_PHONE,
            password: LOGIN_PASSWORD
        });
        
        token = loginResponse.data.data.token;
        console.log('✓ 登录成功，获取到新token:', token.substring(0, 20) + '...');
        console.log('');
        
        // 2. 使用新token创建分享
        console.log('2. 使用新token创建分享...');
        const shareData = {
            musicId: 186016,
            musicTitle: '晴天',
            musicArtist: '周杰伦',
            musicAlbum: '叶惠美',
            musicCover: 'https://p1.music.126.net/W4E4Xn7MZ3qT9Fy4a1dKmA==/109951164364721727.jpg',
            content: '测试分享创建功能',
            tags: '周杰伦,晴天,华语',
            privacy: 'public'
        };
        
        console.log('分享数据:', JSON.stringify(shareData, null, 2));
        
        const shareResponse = await axios.post(`${API_BASE_URL}/api/shares`, shareData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✓ 分享创建成功！');
        console.log('分享ID:', shareResponse.data.data.id);
        console.log('分享内容:', shareResponse.data.data.content);
        console.log('');
        
        // 3. 验证分享是否真的存在（可选）
        console.log('3. 验证分享是否存在...');
        const getShareResponse = await axios.get(`${API_BASE_URL}/api/shares/${shareResponse.data.data.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✓ 分享验证成功！');
        console.log('获取到的分享标题:', getShareResponse.data.data.musicTitle);
        console.log('');
        
        console.log('=== 测试分享创建完整流程成功完成！ ===');
        
    } catch (error) {
        console.error('测试过程中出现错误:', error.message);
        if (error.response) {
            console.error('错误响应状态:', error.response.status);
            console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2));
            console.error('请求头:', JSON.stringify(error.config.headers, null, 2));
        } else {
            console.error('请求错误:', error);
        }
        console.log('\n=== 测试分享创建完整流程失败！ ===');
    }
}

// 运行测试
testShareCreationFlow();