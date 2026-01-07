// 测试脚本：检查搜索API返回的数据结构，特别是专辑封面字段
import axios from 'axios';

// 直接测试我们项目中的搜索API逻辑
console.log('=== 测试项目中的搜索API逻辑 ===');

// 导入项目中的API函数
import { searchMusic } from './src/api/netease.js';

// 测试搜索API
testSearchFunction();
async function testSearchFunction() {
  try {
    console.log('调用项目中的searchMusic函数...');
    
    const keyword = '周杰伦';
    const limit = 5;
    
    console.log(`搜索关键词: ${keyword}`);
    console.log(`限制结果数量: ${limit}`);
    
    // 调用项目中的搜索函数
    const results = await searchMusic(keyword, limit);
    
    console.log('\nsearchMusic函数返回结果:');
    console.log(JSON.stringify(results, null, 2));
    
    // 检查结果中的封面字段
    console.log('\n=== 封面URL分析 ===');
    results.forEach((music, index) => {
      console.log(`\n歌曲 ${index + 1}:`);
      console.log(`  名称: ${music.name}`);
      console.log(`  歌手: ${music.artist}`);
      console.log(`  专辑: ${typeof music.album === 'object' ? music.album.name : music.album}`);
      console.log(`  专辑ID: ${typeof music.album === 'object' ? music.album.id : 'N/A'}`);
      console.log(`  封面URL: ${music.pic}`);
      console.log(`  封面类型: ${music.pic.includes('placeholder.com') ? '默认占位符' : '实际专辑封面'}`);
    });
    
    // 统计封面URL的情况
    const placeholderCovers = results.filter(music => music.pic.includes('placeholder.com'));
    const actualCovers = results.filter(music => !music.pic.includes('placeholder.com'));
    
    console.log('\n=== 封面URL统计 ===');
    console.log(`总歌曲数: ${results.length}`);
    console.log(`使用默认占位符的歌曲数: ${placeholderCovers.length}`);
    console.log(`使用实际专辑封面的歌曲数: ${actualCovers.length}`);
    
  } catch (error) {
    console.error('测试搜索函数过程中出错:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('请求已发送但没有收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.config);
    }
  }
}

// 专辑API测试已移除，因为neteaseSearchApi未导出