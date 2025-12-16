// 测试网易云音乐图片API是否正常工作
import axios from 'axios';

// 测试不同格式的网易云音乐图片URL

// 测试直接使用API返回的img1v1Url格式
const testImg1v1Url = async () => {
  try {
    // 这是从API返回的实际有效图片URL
    const img1v1Url = 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg';
    console.log('测试API返回的img1v1Url:', img1v1Url);
    
    const response = await axios.head(img1v1Url, {
      timeout: 10000
    });
    
    console.log('✓ img1v1Url请求成功，状态码:', response.status);
    console.log('✓ Content-Type:', response.headers['content-type']);
    console.log('✓ 图片URL有效:', img1v1Url);
    return true;
  } catch (error) {
    console.error('✗ img1v1Url请求失败:', error.message);
    return false;
  }
};

// 测试使用第三方API
const testThirdPartyApi = async () => {
  try {
    // 从API返回的实际歌曲ID
    const songId = '1317494434';
    const picUrl = `https://api.injahow.cn/meting/api?server=netease&type=pic&id=${songId}`;
    console.log('\n测试第三方图片API:', picUrl);
    
    const response = await axios.head(picUrl, {
      timeout: 10000
    });
    
    console.log('✓ 第三方API请求成功，状态码:', response.status);
    console.log('✓ Content-Type:', response.headers['content-type']);
    console.log('✓ 图片URL应该有效:', picUrl);
    return true;
  } catch (error) {
    console.error('✗ 第三方API请求失败:', error.message);
    return false;
  }
};

// 测试不同的网易云图片URL格式
const testNeteaseUrlFormats = async () => {
  // 从搜索API返回的实际picId
  const picId = '109951163038292180';
  
  // 测试不同的URL格式
  const urlFormats = [
    `https://p1.music.126.net/${picId}.jpg`,
    `https://p2.music.126.net/${picId}.jpg`,
    `https://p3.music.126.net/${picId}.jpg`,
    `https://p4.music.126.net/${picId}.jpg`,
    `https://music.163.com/api/pic/get?type=url&id=${picId}&dimension=300`,
    `https://music.163.com/api/pic/get?type=url&id=${picId}&dimension=640`
  ];
  
  console.log('\n测试不同的网易云图片URL格式:');
  
  for (const url of urlFormats) {
    try {
      const response = await axios.head(url, {
        timeout: 5000,
        headers: {
          'Referer': 'https://music.163.com/'
        }
      });
      
      console.log(`✓ ${url}`);
      console.log(`  状态码: ${response.status}`);
      console.log(`  Content-Type: ${response.headers['content-type']}`);
      return url; // 返回第一个有效的URL
    } catch (error) {
      console.log(`✗ ${url}`);
    }
  }
  
  return null;
};

// 测试直接使用专辑封面的正确URL格式
const testAlbumCoverUrl = async () => {
  try {
    // 从API返回的实际专辑信息
    const albumId = '34439096';
    const albumName = 'Kung Fu Panda 3 (Music from the Motion Picture)';
    
    // 尝试使用专辑API获取封面
    const albumUrl = `https://music.163.com/api/album/${albumId}`;
    console.log('\n测试专辑API:', albumUrl);
    
    const response = await axios.get(albumUrl, {
      timeout: 10000,
      headers: {
        'Referer': 'https://music.163.com/'
      }
    });
    
    if (response.data.code === 200 && response.data.album && response.data.album.picUrl) {
      const picUrl = response.data.album.picUrl;
      console.log('✓ 专辑API请求成功，获取到封面URL:', picUrl);
      
      // 测试封面URL是否有效
      const picResponse = await axios.head(picUrl, {
        timeout: 5000
      });
      
      console.log('✓ 专辑封面URL有效:', picUrl);
      console.log('  状态码:', picResponse.status);
      console.log('  Content-Type:', picResponse.headers['content-type']);
      return picUrl;
    } else {
      console.error('✗ 专辑API返回数据格式异常:', response.data);
      return null;
    }
  } catch (error) {
    console.error('✗ 专辑API请求失败:', error.message);
    return null;
  }
};

// 执行测试
async function runTests() {
  console.log('开始测试网易云音乐图片API...');
  console.log('='.repeat(50));
  
  const successResults = [];
  
  // 测试各种URL格式
  const img1v1Success = await testImg1v1Url();
  const thirdPartySuccess = await testThirdPartyApi();
  const neteaseFormatUrl = await testNeteaseUrlFormats();
  const albumCoverUrl = await testAlbumCoverUrl();
  
  // 收集成功的URL
  if (img1v1Success) {
    successResults.push('API返回的img1v1Url格式');
  }
  if (thirdPartySuccess) {
    successResults.push('第三方API图片URL');
  }
  if (neteaseFormatUrl) {
    successResults.push('网易云图片URL格式');
  }
  if (albumCoverUrl) {
    successResults.push('专辑封面URL');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('测试完成！');
  
  if (successResults.length > 0) {
    console.log('\n✓ 以下图片URL格式测试成功：');
    successResults.forEach(result => console.log(`  - ${result}`));
  } else {
    console.log('\n✗ 所有图片URL格式测试均失败！');
  }
}

runTests();
