<template>
  <div class="recommendations-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>所有分享</h1>
      <p>发现大家分享的精彩音乐</p>
    </div>

    <!-- 分享列表 -->
    <div class="shares-container">
      <div 
        v-for="share in allShares" 
        :key="share.id" 
        class="share-card"
        @click="playMusic(share)"
      >
        <div class="card-cover">
          <img :src="share.cover" :alt="share.musicName" />
          <div class="cover-overlay">
            <div class="play-button">
              <el-icon size="24"><VideoPlay /></el-icon>
            </div>
          </div>
          <div class="cover-info">
            <span class="play-count">
              <el-icon><View /></el-icon>
              {{ formatCount(share.playCount) }}
            </span>
            <span class="duration">{{ share.duration }}</span>
          </div>
        </div>
        <div class="card-content">
          <h4 class="music-title line-clamp-1">{{ share.musicName }}</h4>
          <p class="artist-name line-clamp-1">{{ share.artist }}</p>
          <div class="user-info">
            <el-avatar :size="24" :src="share.userAvatar" />
            <span class="user-name line-clamp-1">{{ share.userName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <el-skeleton :rows="3" animated v-if="loading" />

    <!-- 空状态 -->
    <div v-if="!loading && allShares.length === 0" class="empty-state">
      <el-empty description="暂无分享数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VideoPlay, View } from '@element-plus/icons-vue'
import { fetchAllShares } from '../api/index'

// 所有分享数据
const allShares = ref([])
const loading = ref(true)

// 获取所有分享数据
const fetchAllSharesData = async () => {
  try {
    loading.value = true
    const response = await fetchAllShares()
    // 处理API返回的数据结构
    const sharesData = Array.isArray(response) ? response : response.Content || []
    if (sharesData.length > 0) {
      // 将后端返回的数据转换为我们需要的格式
      allShares.value = sharesData.map((item) => ({
        id: item.id,
        musicName: item.musicTitle,
        artist: item.musicArtist,
        cover: item.musicCover || 'https://via.placeholder.com/80x80/666666/ffffff?text=音乐封面',
        userName: item.user?.nickname || '未知用户',
        userAvatar: item.user?.avatar || 'https://via.placeholder.com/32x32/cccccc/ffffff?text=用户',
        playCount: item.likedCount || 0,
        duration: '未知时长'
      }))
    }
  } catch (error) {
    console.error('获取所有分享失败:', error)
  } finally {
    loading.value = false
  }
}

// 播放音乐
const playMusic = (share) => {
  console.log('播放音乐:', share.musicName)
  // 这里可以添加播放音乐的逻辑
}

// 格式化数字
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

// 页面加载时获取数据
onMounted(() => {
  fetchAllSharesData()
})
</script>

<style scoped>
.recommendations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.shares-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.share-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.share-card:hover .cover-overlay {
  opacity: 1;
}

.play-button {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42b983;
}

.cover-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 12px;
}

.cover-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  padding: 16px;
}

.music-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.artist-name {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  color: #666;
}

/* 文本截断工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .shares-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .page-header {
    padding: 20px 0;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .recommendations-page {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .shares-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>