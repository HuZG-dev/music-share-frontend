<template>
  <div class="hot-page">
    <!-- 头部Banner -->
    <div class="page-banner">
      <div class="banner-content">
        <h1 class="banner-title">🔥 热门分享</h1>
        <p class="banner-desc">发现当下最受欢迎的音乐分享</p>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="content-container">
      <!-- 筛选栏 -->
      <div class="filter-tabs">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-tab', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- 榜单列表 -->
      <div class="share-list">
        <div 
          v-for="(item, index) in displayList" 
          :key="item.id"
          class="share-card"
          @click="viewShare(item)"
        >
          <!-- 排名 -->
          <div :class="['rank-badge', getRankClass(index)]">
            {{ index + 1 }}
          </div>

          <!-- 封面 -->
          <div class="cover-wrapper">
            <img :src="item.musicCover" :alt="item.musicTitle" class="cover-img">
            <div class="cover-overlay">
              <el-icon :size="32" class="play-icon"><VideoPlay /></el-icon>
            </div>
          </div>

          <!-- 信息 -->
          <div class="share-info">
            <h3 class="music-name">{{ item.musicTitle }}</h3>
            <p class="artist-name">{{ item.musicArtist }}</p>
            <div class="user-line">
              <el-avatar :size="20" :src="item.user?.avatar || '/src/assets/default-avatar.png'" />
              <span class="user-name">{{ item.user?.nickname || '未知用户' }}</span>
            </div>
            <p class="share-content">{{ item.content }}</p>
          </div>

          <!-- 统计 -->
          <div class="stats-area">
            <span class="stat-item">
              <el-icon><Headset /></el-icon>
              {{ formatCount(item.playCount || 0) }}
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ formatCount(item.likedCount || 0) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more-section" v-if="hasMore">
        <el-button 
          :loading="loading" 
          @click="loadMore"
          round
          size="large"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Headset, Star } from '@element-plus/icons-vue'
import { fetchAllShares } from '@/api'

const router = useRouter()

// 筛选项
const filters = [
  { label: '最热', value: 'hot' },
  { label: '最新', value: 'new' },
  { label: '精选', value: 'featured' }
]

const activeFilter = ref('hot')
const loading = ref(false)
const hasMore = ref(true)

// 分享数据
const shareData = ref([])

const displayList = computed(() => shareData.value)

// 获取分享数据
const fetchShares = async () => {
  try {
    loading.value = true
    const response = await fetchAllShares()
    if (response && Array.isArray(response)) {
      shareData.value = response
    }
  } catch (error) {
    console.error('获取分享失败:', error)
  } finally {
    loading.value = false
  }
}

const getRankClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

const formatCount = (count) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count
}

const viewShare = (item) => {
  router.push(`/share/${item.id}`)
}

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    hasMore.value = false
  }, 1000)
}

onMounted(() => {
  fetchShares()
})
</script>

<style scoped>
.hot-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #fff 100%);
}

/* Banner */
.page-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.banner-desc {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

/* 主内容 */
.content-container {
  max-width: 1000px;
  margin: -40px auto 0;
  padding: 0 20px 60px;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: white;
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.filter-tab {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  background: #f8f9fa;
  color: #667eea;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 榜单列表 */
.share-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* 排名徽章 */
.rank-badge {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #999;
  background: #f5f5f5;
  border-radius: 12px;
  flex-shrink: 0;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
  color: white;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #CD7F32, #B8713A);
  color: white;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}

/* 封面 */
.cover-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-img {
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
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.share-card:hover .cover-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
}

/* 分享信息 */
.share-info {
  flex: 1;
  min-width: 0;
}

.music-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-name {
  font-size: 14px;
  color: #999;
  margin: 0 0 12px 0;
}

.user-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.user-name {
  font-size: 13px;
  color: #666;
}

.share-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stats-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.stat-item .el-icon {
  font-size: 16px;
}

/* 趋势徽章 */
.trend-badge {
  width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.trend-badge.up {
  background: #fff1f0;
  color: #ff4d4f;
}

.trend-badge.down {
  background: #f6ffed;
  color: #52c41a;
}

.trend-badge.stable {
  background: #f5f5f5;
  color: #999;
}

/* 加载更多 */
.load-more-section {
  text-align: center;
  margin-top: 40px;
}

/* 响应式 */
@media (max-width: 768px) {
  .banner-title {
    font-size: 32px;
  }
  
  .share-card {
    flex-wrap: wrap;
  }
  
  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .cover-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .music-name {
    font-size: 16px;
  }
  
  .stats-area {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
}
</style>