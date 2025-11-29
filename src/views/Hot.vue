<template>
  <div class="hot-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">🔥 热门音乐</h1>
        <p class="page-subtitle">发现当前最受欢迎的音乐分享</p>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-group">
          <el-button 
            :type="activeFilter === 'all' ? 'primary' : ''" 
            @click="changeFilter('all')"
            class="filter-btn"
          >
            全部
          </el-button>
          <el-button 
            :type="activeFilter === 'popular' ? 'primary' : ''" 
            @click="changeFilter('popular')"
            class="filter-btn"
          >
            最热
          </el-button>
          <el-button 
            :type="activeFilter === 'latest' ? 'primary' : ''" 
            @click="changeFilter('latest')"
            class="filter-btn"
          >
            最新
          </el-button>
          <el-button 
            :type="activeFilter === 'trending' ? 'primary' : ''" 
            @click="changeFilter('trending')"
            class="filter-btn"
          >
            飙升
          </el-button>
        </div>
        
        <div class="filter-group">
          <el-select 
            v-model="selectedCategory" 
            placeholder="全部分类" 
            class="category-select"
            @change="handleCategoryChange"
          >
            <el-option label="全部分类" value="all"></el-option>
            <el-option label="流行" value="pop"></el-option>
            <el-option label="摇滚" value="rock"></el-option>
            <el-option label="电子" value="electronic"></el-option>
            <el-option label="民谣" value="folk"></el-option>
            <el-option label="说唱" value="rap"></el-option>
            <el-option label="古典" value="classical"></el-option>
          </el-select>
          
          <el-select 
            v-model="selectedTime" 
            placeholder="时间范围" 
            class="time-select"
          >
            <el-option label="今日" value="today"></el-option>
            <el-option label="本周" value="week"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content-wrapper">
      <div class="main-content">
        <!-- 左侧热门分享列表 -->
        <div class="content-left">
          <!-- 热门分享排行榜 -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">
                {{ getSectionTitle() }}
                <span class="update-time">最近更新：{{ updateTime }}</span>
              </h2>
            </div>
            
            <!-- 排行榜头部 -->
            <div class="ranking-header">
              <span class="rank-order">排名</span>
              <span class="music-info">音乐信息</span>
              <span class="heat-index">热度指数</span>
              <span class="trend">趋势</span>
            </div>
            
            <!-- 热门分享列表 -->
            <div class="hot-list">
              <div 
                v-for="(share, index) in hotShares" 
                :key="share.id" 
                class="hot-item"
                @click="playMusic(share)"
              >
                <div class="item-left">
                  <span :class="['rank-order', getRankClass(index)]">
                    {{ index + 1 }}
                  </span>
                  <div class="music-cover">
                    <img :src="share.cover" :alt="share.musicName" />
                    <div class="cover-overlay">
                      <div class="play-button">
                        <el-icon size="20"><VideoPlay /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div class="music-info">
                    <h4 class="music-title">{{ share.musicName }}</h4>
                    <p class="artist-name">{{ share.artist }}</p>
                    <div class="user-info">
                      <el-avatar :size="20" :src="share.userAvatar" />
                      <span class="user-name">{{ share.userName }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="item-right">
                  <div class="heat-index">
                    <div class="heat-bar">
                      <div 
                        class="heat-progress" 
                        :style="{ width: getHeatPercentage(share.heat) + '%' }"
                      ></div>
                    </div>
                    <span class="heat-value">{{ formatHeat(share.heat) }}</span>
                  </div>
                  
                  <div class="trend" :class="getTrendClass(share.trend)">
                    <el-icon v-if="share.trend > 0"><Top /></el-icon>
                    <el-icon v-else-if="share.trend < 0"><Bottom /></el-icon>
                    <span v-else>-</span>
                    <span v-if="share.trend !== 0">{{ Math.abs(share.trend) }}</span>
                  </div>
                  
                  <div class="action-buttons">
                    <el-button 
                      size="small" 
                      :icon="Star" 
                      :type="share.liked ? 'primary' : ''"
                      @click.stop="toggleLike(share)"
                    >
                      {{ share.likeCount }}
                    </el-button>
                    <el-button 
                      size="small" 
                      :icon="Share"
                      @click.stop="handleShare(share)"
                    >
                      分享
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多 -->
            <div class="load-more">
              <el-button 
                type="primary" 
                :loading="loading" 
                @click="loadMore"
                class="load-more-btn"
              >
                {{ hasMore ? '加载更多' : '没有更多了' }}
              </el-button>
            </div>
          </section>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 热门创作者 -->
          <div class="creators-card">
            <div class="card-header">
              <h4>热门创作者</h4>
            </div>
            <div class="creators-list">
              <div 
                v-for="creator in hotCreators" 
                :key="creator.id" 
                class="creator-item"
                @click="goToCreator(creator)"
              >
                <el-avatar :size="40" :src="creator.avatar" />
                <div class="creator-info">
                  <h5>{{ creator.name }}</h5>
                  <p>{{ creator.followers }} 粉丝 · {{ creator.shares }} 分享</p>
                </div>
                <el-button 
                  size="small" 
                  :type="creator.followed ? 'primary' : ''"
                  @click.stop="toggleFollow(creator)"
                >
                  {{ creator.followed ? '已关注' : '关注' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 音乐分类 -->
          <div class="category-card">
            <div class="card-header">
              <h4>音乐分类</h4>
            </div>
            <div class="category-list">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-item"
                @click="filterByCategory(category.id)"
              >
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  VideoPlay, Star, Share, Top, Bottom
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeFilter = ref('popular')
const selectedCategory = ref('all')
const selectedTime = ref('week')
const loading = ref(false)
const hasMore = ref(true)
const updateTime = ref('刚刚')

// 模拟数据
const hotShares = ref([
  {
    id: 1,
    musicName: '孤勇者',
    artist: '陈奕迅',
    cover: '/images/placeholders/280x160-667eea.jpg',
    userName: '英雄联盟',
    userAvatar: '/images/placeholders/40x40.jpg',
    heat: 985432,
    trend: 12,
    likeCount: 45678,
    liked: false,
    playCount: 1234567,
    duration: '04:15'
  },
  {
    id: 2,
    musicName: '光年之外',
    artist: 'G.E.M.邓紫棋',
    cover: '/images/placeholders/280x160-764ba2.jpg',
    userName: '星空探索者',
    userAvatar: '/images/placeholders/40x40.jpg',
    heat: 876543,
    trend: 8,
    likeCount: 38965,
    liked: true,
    playCount: 987654,
    duration: '04:05'
  },
  {
    id: 3,
    musicName: '起风了',
    artist: '买辣椒也用券',
    cover: '/images/placeholders/280x160-f093fb.jpg',
    userName: '风之旅人',
    userAvatar: '/images/placeholders/40x40.jpg',
    heat: 765432,
    trend: -3,
    likeCount: 34567,
    liked: false,
    playCount: 876543,
    duration: '03:45'
  },
  {
    id: 4,
    musicName: '星辰大海',
    artist: '黄霄雲',
    cover: '/images/placeholders/280x160-4ecdc4.jpg',
    userName: '追梦人',
    userAvatar: '/images/placeholders/40x40.jpg',
    heat: 654321,
    trend: 25,
    likeCount: 29876,
    liked: false,
    playCount: 765432,
    duration: '03:55'
  },
  {
    id: 5,
    musicName: '少年',
    artist: '梦然',
    cover: '/images/placeholders/280x160-ff6b6b.jpg',
    userName: '青春纪念册',
    userAvatar: '/images/placeholders/40x40.jpg',
    heat: 543210,
    trend: 5,
    likeCount: 26789,
    liked: true,
    playCount: 654321,
    duration: '04:10'
  }
])

const hotCreators = ref([
  { id: 1, name: '音乐达人小张', avatar: '/images/placeholders/40x40.jpg', followers: '12.3万', shares: 456, followed: false },
  { id: 2, name: '旋律猎人', avatar: '/images/placeholders/40x40.jpg', followers: '8.7万', shares: 321, followed: true },
  { id: 3, name: '节奏大师', avatar: '/images/placeholders/40x40.jpg', followers: '6.5万', shares: 234, followed: false },
  { id: 4, name: '和声之美', avatar: '/images/placeholders/40x40.jpg', followers: '5.2万', shares: 198, followed: false }
])

const categories = ref([
  { id: 1, name: '流行音乐', count: '12.5万' },
  { id: 2, name: '摇滚', count: '8.7万' },
  { id: 3, name: '电子', count: '6.3万' },
  { id: 4, name: '民谣', count: '5.4万' },
  { id: 5, name: '说唱', count: '4.8万' },
  { id: 6, name: '古典', count: '3.2万' },
  { id: 7, name: '爵士', count: '2.1万' },
  { id: 8, name: '轻音乐', count: '1.8万' }
])

// 计算属性
const getSectionTitle = () => {
  const titles = {
    all: '热门分享',
    popular: '最热分享',
    latest: '最新分享',
    trending: '飙升榜单'
  }
  return titles[activeFilter.value] || '热门分享'
}

// 方法
const changeFilter = (filter) => {
  activeFilter.value = filter
  refreshData()
}

const handleCategoryChange = () => {
  refreshData()
}

const playMusic = (share) => {
  console.log('播放音乐:', share.musicName)
}

const getRankClass = (index) => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const getTrendClass = (trend) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return 'trend-stable'
}

const getHeatPercentage = (heat) => {
  const maxHeat = Math.max(...hotShares.value.map(item => item.heat))
  return (heat / maxHeat) * 100
}

const formatHeat = (heat) => {
  if (heat >= 10000) {
    return (heat / 10000).toFixed(1) + '万'
  }
  return heat.toString()
}

const toggleLike = (share) => {
  share.liked = !share.liked
  share.likeCount += share.liked ? 1 : -1
}

const handleShare = (share) => {
  console.log('分享音乐:', share.musicName)
}

const loadMore = () => {
  if (!hasMore.value) return
  
  loading.value = true
  setTimeout(() => {
    // 模拟加载更多数据
    const newShares = [...hotShares.value]
    for (let i = 1; i <= 5; i++) {
      newShares.push({
        id: newShares.length + i,
        musicName: `热门歌曲 ${newShares.length + i}`,
        artist: '热门歌手',
        cover: '/images/placeholders/280x160-667eea.jpg',
        userName: '音乐爱好者',
        userAvatar: '/images/placeholders/40x40.jpg',
        heat: 500000 - i * 10000,
        trend: i % 3 === 0 ? -2 : i % 3 === 1 ? 5 : 0,
        likeCount: 20000 + i * 1000,
        liked: false,
        playCount: 500000 + i * 10000,
        duration: '04:00'
      })
    }
    hotShares.value = newShares
    loading.value = false
    hasMore.value = hotShares.value.length < 25
  }, 1500)
}

const goToCreator = (creator) => {
  router.push(`/user/${creator.id}`)
}

const toggleFollow = (creator) => {
  creator.followed = !creator.followed
}

const filterByCategory = (categoryId) => {
  console.log('筛选分类:', categoryId)
  selectedCategory.value = categoryId
  refreshData()
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    updateTime.value = new Date().toLocaleTimeString()
  }, 1000)
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.hot-page {
  background-color: #f4f4f4;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px 0;
  margin-bottom: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn {
  border-radius: 20px;
  padding: 8px 20px;
}

.category-select,
.time-select {
  width: 120px;
}

/* 主要内容区域 */
.main-content-wrapper {
  background-color: #f4f4f4;
  width: 100%;
  padding: 20px 0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  padding: 0 20px;
}

/* 区块通用样式 */
.section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  font-size: 14px;
  color: #999;
  font-weight: normal;
}

/* 排行榜头部 */
.ranking-header {
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px;
  gap: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 热门列表 */
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hot-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.hot-item:hover {
  background: #f8f9fa;
  border-color: #e8f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rank-order {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: white;
}

.rank-2 {
  background: linear-gradient(135deg, #ff7a45, #ff9c6e);
  color: white;
}

.rank-3 {
  background: linear-gradient(135deg, #ffa940, #ffc069);
  color: white;
}

.music-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.music-cover img {
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

.hot-item:hover .cover-overlay {
  opacity: 1;
}

.play-button {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42b983;
}

.music-info {
  flex: 1;
}

.music-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.artist-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 12px;
  color: #999;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.heat-index {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 140px;
}

.heat-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.heat-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff4d4f, #ff7a45);
  border-radius: 3px;
  transition: width 0.3s;
}

.heat-value {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  width: 50px;
  text-align: right;
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  width: 60px;
  justify-content: center;
}

.trend-up {
  color: #ff4d4f;
}

.trend-down {
  color: #52c41a;
}

.trend-stable {
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.load-more-btn {
  border-radius: 20px;
  padding: 10px 32px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.creators-card,
.category-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 创作者列表 */
.creators-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.creator-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 8px;
}

.creator-item:hover {
  background-color: #f8f9fa;
}

.creator-info {
  flex: 1;
}

.creator-info h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.creator-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 分类列表 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #42b983;
  color: white;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}

.category-count {
  font-size: 12px;
  color: #999;
}

.category-item:hover .category-count {
  color: rgba(255,255,255,0.8);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .ranking-header {
    grid-template-columns: 60px 1fr 150px 80px;
    font-size: 12px;
  }
  
  .item-right {
    gap: 16px;
  }
  
  .heat-index {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .ranking-header {
    display: none;
  }
  
  .hot-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .item-right {
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .section {
    padding: 16px;
  }
  
  .item-left {
    gap: 12px;
  }
  
  .music-cover {
    width: 50px;
    height: 50px;
  }
  
  .rank-order {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}
</style>