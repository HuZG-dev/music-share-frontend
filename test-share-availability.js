const axios = require('axios');
const fs = require('fs');

// 配置
const baseURL = 'http://localhost:8080';
let token = '';
let userId = '';

// 创建axios实例
const api = axios.create({
    baseURL,
    timeout: 5000
});

// 使用已有的测试账号
const testUser = {
    phone: '13815751208',
    password: '123456'
};

// 登录获取token
async function login() {
    console.log('\n正在登录...');
    console.log('测试账号:', testUser.phone);
    
    try {
        const response = await api.post('/api/auth/login', {
            phone: testUser.phone,
            password: testUser.password
        });
        
        console.log('登录响应:', response.data);
        
        if (response.data.code === 200) {
            token = response.data.data.token;
            userId = response.data.data.userInfo.id;
            
            // 设置默认请求头
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            console.log('登录成功，获取到token:', token);
            console.log('用户ID:', userId);
            return true;
        } else {
            console.error('登录失败:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('登录请求失败:', error);
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else if (error.request) {
            console.error('没有收到响应:', error.request);
        } else {
            console.error('请求配置错误:', error.message);
        }
        return false;
    }
}

// 创建测试分享（包含可用和不可用的歌曲）
async function createTestShares() {
    console.log('\n正在创建测试分享...');
    
    // 测试数据：包含可用和不可用的歌曲
    const testShares = [
        // 可用的歌曲ID
        {
            musicId: '28712942', // Taylor Swift - Blank Space (可用)
            musicTitle: 'Blank Space',
            musicArtist: 'Taylor Swift',
            musicAlbum: '1989',
            musicCover: 'https://p1.music.126.net/m4aO0eQj8Cv38YqF6V4Uyw==/109951163462725661.jpg',
            content: '这是一首可用的歌曲测试',
            tags: '流行,测试',
            privacy: 'public'
        },
        // 不可用的歌曲ID
        {
            musicId: '999999999', // 不存在的歌曲ID
            musicTitle: '不存在的歌曲',
            musicArtist: '未知歌手',
            musicAlbum: '未知专辑',
            musicCover: 'https://example.com/cover.jpg',
            content: '这是一首不可用的歌曲测试',
            tags: '测试,不可用',
            privacy: 'public'
        }
    ];
    
    const createdShares = [];
    
    for (const shareData of testShares) {
        try {
            const response = await api.post('/api/shares', shareData);
            const share = response.data.data;
            createdShares.push(share);
            console.log(`分享创建成功: ${share.musicTitle} (ID: ${share.id})`);
        } catch (error) {
            console.error('创建分享失败:', error.response?.data || error.message);
        }
    }
    
    return createdShares;
}

// 检查音乐可用性
async function checkMusicAvailability(musicId) {
    try {
        const response = await axios.get(`http://music.163.com/api/song/detail/?ids=[${musicId}]`, {
            timeout: 3000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        return response.data.songs && response.data.songs.length > 0;
    } catch (error) {
        return false;
    }
}

// 检查分享中的音乐可用性
async function checkSharesAvailability(shares) {
    console.log('\n正在检查分享中的音乐可用性...');
    
    const unavailableShares = [];
    
    for (const share of shares) {
        const isAvailable = await checkMusicAvailability(share.musicId);
        console.log(`分享ID: ${share.id}, 歌曲: ${share.musicTitle}, 可用: ${isAvailable}`);
        
        if (!isAvailable) {
            unavailableShares.push(share);
        }
    }
    
    return unavailableShares;
}

// 删除不可用的分享
async function deleteUnavailableShares(unavailableShares) {
    console.log('\n正在删除不可用的分享...');
    
    for (const share of unavailableShares) {
        try {
            await api.post(`/api/shares/delete/${share.id}`);
            console.log(`已删除不可用的分享: ${share.musicTitle} (ID: ${share.id})`);
        } catch (error) {
            console.error(`删除分享失败: ${share.musicTitle} (ID: ${share.id})`, error.response?.data || error.message);
        }
    }
}

// 获取用户所有分享
async function getUserShares() {
    console.log('\n正在获取用户所有分享...');
    
    try {
        const response = await api.get('/api/shares/user');
        return response.data.data;
    } catch (error) {
        console.error('获取分享失败:', error.response?.data || error.message);
        return [];
    }
}

// 主测试流程
async function main() {
    try {
        // 1. 登录
        await login();
        
        // 2. 创建测试分享
        const createdShares = await createTestShares();
        
        // 3. 检查音乐可用性
        const unavailableShares = await checkSharesAvailability(createdShares);
        
        // 4. 删除不可用的分享
        await deleteUnavailableShares(unavailableShares);
        
        // 5. 验证删除结果
        const remainingShares = await getUserShares();
        console.log('\n删除后剩余的分享:');
        remainingShares.forEach(share => {
            console.log(`- ${share.musicTitle} (ID: ${share.id})`);
        });
        
        console.log('\n测试流程完成！');
        console.log('总结:');
        console.log(`- 成功创建 ${createdShares.length} 个分享`);
        console.log(`- 发现 ${unavailableShares.length} 个不可用的分享`);
        console.log(`- 成功删除 ${unavailableShares.length} 个不可用的分享`);
        console.log(`- 剩余 ${remainingShares.length} 个分享`);
        
    } catch (error) {
        console.error('测试过程中出现错误:', error);
    }
}

// 执行测试
main();
