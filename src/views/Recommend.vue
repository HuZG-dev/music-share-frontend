<template>
  <div class="home">
    <!-- 轮播图区域 -->
    <section class="banner-section">
      <div class="banner-container">
        <el-carousel height="320px" :interval="4000" arrow="always">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
              <div class="banner-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <el-button type="primary" size="large" @click="handleBannerClick(item)">
                  {{ item.buttonText || '立即查看' }}
                </el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="main-content-wrapper">
      <div class="main-content">
        <!-- 左侧内容 -->
        <div class="content-left">
          <!-- 推荐分享 -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">推荐分享</h2>
            </div>
            <div class="share-grid">
              <div 
                v-for="share in recommendedShares" 
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
          </section>

          <!-- 热门活动 -->
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">热门活动</h2>
            </div>
            <div class="activities-grid">
              <div 
                v-for="activity in hotActivities" 
                :key="activity.id" 
                class="activity-card"
                @click="handleActivityClick(activity)"
              >
                <div class="activity-cover">
                  <img :src="activity.cover" :alt="activity.title" />
                  <div class="activity-tag" :class="activity.tagType">
                    {{ activity.tag }}
                  </div>
                </div>
                <div class="activity-content">
                  <h4 class="activity-title line-clamp-1">{{ activity.title }}</h4>
                  <p class="activity-desc line-clamp-2">{{ activity.description }}</p>
                  <div class="activity-meta">
                    <span class="activity-time">{{ activity.time }}</span>
                    <span class="activity-participants">{{ activity.participants }}人参与</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 热门排行 -->
          <div class="ranking-card">
            <div class="card-header">
              <h4>热门排行</h4>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(share, index) in hotShares" 
                :key="share.id" 
                class="ranking-item"
                @click="playMusic(share)"
              >
                <span :class="['ranking-order', getRankClass(index)]">{{ index + 1 }}</span>
                <div class="ranking-info">
                  <h5 class="line-clamp-1">{{ share.musicName }}</h5>
                  <p class="line-clamp-1">{{ share.artist }}</p>
                </div>
                <span class="play-count">{{ formatCount(share.playCount) }}</span>
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
              </div>
            </div>
          </div>

          <!-- 最新分享 -->
          <div class="latest-card">
            <div class="card-header">
              <h4>最新分享</h4>
            </div>
            <div class="latest-list">
              <div 
                v-for="share in latestShares" 
                :key="share.id"
                class="latest-item"
                @click="playMusic(share)"
              >
                <el-avatar :size="32" :src="share.userAvatar" />
                <div class="latest-info">
                  <h6 class="line-clamp-1">{{ share.musicName }}</h6>
                  <p class="line-clamp-1">{{ share.userName }} · {{ share.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  VideoPlay, View
} from '@element-plus/icons-vue'
import { getBanners } from '../api/banner'
import { getRecommendedPlaylists, getHotSongs } from '../api/netease'

const router = useRouter()

// 轮播图数据
const banners = ref([])

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    console.log('开始获取轮播图数据...')
    const response = await getBanners()
    console.log('API返回的完整响应:', response)
    
    // 将相对路径转换为完整URL
    const bannersWithFullUrl = (response || []).map(banner => ({
      ...banner,
      image: `http://localhost:8080${banner.image}`
    }))
    
    banners.value = bannersWithFullUrl
    console.log('最终轮播图数据:', banners.value)
  } catch (error) {
    console.error('获取轮播图数据失败:', error)
    console.error('错误详情:', error.response || error.message)
  }
}

// 推荐分享数据
const recommendedShares = ref([
  {
    id: 1,
    musicName: '精选华语流行',
    artist: '华语乐坛精选',
    cover: '/src/assets/default-music-cover.png',
    userName: '音乐精选官',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 1234567,
    duration: '未知时长'
  },
  {
    id: 2,
    musicName: '经典英文老歌',
    artist: '欧美经典',
    cover: '/src/assets/default-music-cover.png',
    userName: '老歌回忆录',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 891234,
    duration: '未知时长'
  },
  {
    id: 3,
    musicName: '热门电音派对',
    artist: '电音狂欢',
    cover: '/src/assets/default-music-cover.png',
    userName: '电音小助手',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 567890,
    duration: '未知时长'
  },
  {
    id: 4,
    musicName: '治愈系轻音乐',
    artist: '放松身心',
    cover: '/src/assets/default-music-cover.png',
    userName: '治愈系音乐',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 456789,
    duration: '未知时长'
  },
  {
    id: 5,
    musicName: '摇滚经典合集',
    artist: '摇滚传奇',
    cover: '/src/assets/default-music-cover.png',
    userName: '摇滚不死',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 345678,
    duration: '未知时长'
  },
  {
    id: 6,
    musicName: '中国风精选',
    artist: '国韵飘香',
    cover: '/src/assets/default-music-cover.png',
    userName: '中国风音乐',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 234567,
    duration: '未知时长'
  }
])

// 获取推荐分享数据
const fetchRecommendedShares = async () => {
  try {
    const response = await getRecommendedPlaylists(6)
    if (response && response.result) {
      // 将网易云音乐API返回的数据转换为我们需要的格式
      recommendedShares.value = response.result.map(item => ({
        id: item.id,
        musicName: item.name,
        artist: item.copywriter || '未知艺术家',
        cover: item.picUrl || '/src/assets/default-music-cover.png',
        userName: item.creator ? item.creator.nickname : '未知用户',
        userAvatar: item.creator ? item.creator.avatarUrl : '/src/assets/default-avatar.png',
        playCount: item.playCount || 0,
        duration: '未知时长'
      }))
    }
  } catch (error) {
    console.error('获取推荐分享失败，使用模拟数据:', error)
    // 使用模拟数据，已经在上面定义
  }
}

// 活动封面图片辅助函数
const activityCover = (fileName) => {
  // 返回活动封面图片的完整URL
  return `http://localhost:8080/uploads/activities/${fileName}`
}

const hotActivities = ref([
  {
    id: 1,
    title: '周末音乐派对',
    description: '线上音乐交流活动，与音乐爱好者一起分享',
    cover: activityCover('音乐分享大赛.png'),
    tag: '进行中',
    tagType: 'active',
    time: '本周六 20:00',
    participants: 234
  },
  {
    id: 2,
    title: '原创音乐征集',
    description: '征集优秀原创音乐作品，展示你的才华',
    cover: activityCover('原创音乐人计划.png'),
    tag: '火热',
    tagType: 'hot',
    time: '长期有效',
    participants: 567
  },
  {
    id: 3,
    title: '音乐知识竞赛',
    description: '测试你的音乐知识，赢取音乐周边',
    cover: activityCover('经典老歌回顾.png'),
    tag: '新活动',
    tagType: 'new',
    time: '下月开启',
    participants: 89
  }
])

// 热门分享数据
const hotShares = ref([
  {
    id: 1001,
    musicName: '晴天',
    artist: '周杰伦',
    playCount: 9876543
  },
  {
    id: 1002,
    musicName: '起风了',
    artist: '买辣椒也用券',
    playCount: 8765432
  },
  {
    id: 1003,
    musicName: '孤勇者',
    artist: '陈奕迅',
    playCount: 7654321
  },
  {
    id: 1004,
    musicName: '光年之外',
    artist: '邓紫棋',
    playCount: 6543210
  },
  {
    id: 1005,
    musicName: '海阔天空',
    artist: 'Beyond',
    playCount: 5432109
  }
])

// 获取热门分享数据
const fetchHotShares = async () => {
  try {
    const response = await getHotSongs(5)
    if (response && response.data) {
      // 将网易云音乐API返回的数据转换为我们需要的格式
      hotShares.value = response.data.map(item => ({
        id: item.id,
        musicName: item.name,
        artist: item.ar && item.ar.length > 0 ? item.ar.map(artist => artist.name).join('/') : '未知艺术家',
        playCount: item.popularity || 0
      }))
    }
  } catch (error) {
    console.error('获取热门分享失败，使用模拟数据:', error)
    // 使用模拟数据，已经在上面定义
  }
}

const categories = ref([
  { id: 1, name: '流行' },
  { id: 2, name: '摇滚' },
  { id: 3, name: '民谣' },
  { id: 4, name: '电子' },
  { id: 5, name: '古典' },
  { id: 6, name: '爵士' }
])

const latestShares = ref([
  {
    id: 1,
    musicName: '夜曲',
    artist: '周杰伦',
    userName: '音乐达人',
    userAvatar: '/src/assets/default-avatar.png',
    time: '2分钟前'
  },
  {
    id: 2,
    musicName: '七里香',
    artist: '周杰伦',
    userName: '旋律猎人',
    userAvatar: '/src/assets/default-avatar.png',
    time: '5分钟前'
  },
  {
    id: 3,
    musicName: '青花瓷',
    artist: '周杰伦',
    userName: '中国风',
    userAvatar: '/src/assets/default-avatar.png',
    time: '10分钟前'
  },
  {
    id: 4,
    musicName: '简单爱',
    artist: '周杰伦',
    userName: '爱情故事',
    userAvatar: '/src/assets/default-avatar.png',
    time: '15分钟前'
  }
])

// 方法
const playMusic = (share) => {
  console.log('播放音乐:', share.musicName)
}

const handleBannerClick = (banner) => {
  // 由于所有轮播图都是活动相关的，直接跳转到活动页面
  router.push('/activities')
}

const handleActivityClick = (activity) => {
  router.push(`/activity/${activity.id}`)
}

const getRankClass = (index) => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

const filterByCategory = (categoryId) => {
  console.log('筛选分类:', categoryId)
}

onMounted(() => {
  // 获取轮播图数据
  fetchBanners()
  // 获取推荐分享数据
  fetchRecommendedShares()
  // 获取热门分享数据
  fetchHotShares()
})
</script>

<style scoped>
.home {
  background-color: #f4f4f4;
  min-height: 100vh;
}

/* 轮播图区域 */
.banner-section {
  background: white;
  padding: 0;
}

.banner-container {
  width: 100%;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.banner-content h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.banner-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

/* 主要内容区域 - 全宽度 */
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
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 文本截断工具类 */
.line-clamp-1 {
  display: -webkit-box;
  /* -webkit-line-clamp: 1; */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2;/ */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分享网格布局 */
.share-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.share-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 160px;
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
  background: rgba(0,0,0,0.4);
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
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.9);
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
  padding: 12px;
}

.music-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.artist-name {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 12px;
  color: #666;
}

/* 活动网格 */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.activity-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.activity-cover {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.activity-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.activity-tag.active {
  background: #ff4d4f;
}

.activity-tag.hot {
  background: #ff7a45;
}

.activity-tag.new {
  background: #52c41a;
}

.activity-content {
  padding: 12px;
}

.activity-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.activity-desc {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ranking-card, .category-card, .latest-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
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

/* 排行列表 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.ranking-item:hover {
  background-color: #f8f9fa;
}

.ranking-order {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #666;
  flex-shrink: 0;
}

.rank-1 {
  background: #ff4d4f;
  color: white;
}

.rank-2 {
  background: #ff7a45;
  color: white;
}

.rank-3 {
  background: #ffa940;
  color: white;
}

.ranking-info {
  flex: 1;
  min-width: 0; /* 防止flex项目溢出 */
}

.ranking-info h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.ranking-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.play-count {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

/* 分类列表 */
.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.category-item:hover {
  background: #42b983;
  color: white;
}

.category-name {
  font-size: 14px;
}

/* 最新分享列表 */
.latest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.latest-item:hover {
  background-color: #f8f9fa;
}

.latest-info {
  flex: 1;
  min-width: 0; /* 防止flex项目溢出 */
}

.latest-info h6 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.latest-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .share-grid,
  .activities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .share-grid,
  .activities-grid {
    grid-template-columns: 1fr;
  }
  
  .banner-content {
    padding: 20px;
  }
  
  .banner-content h3 {
    font-size: 20px;
  }
  
  .banner-content p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 16px;
  }
  
  .share-grid,
  .activities-grid {
    gap: 12px;
  }
  
  .category-list {
    grid-template-columns: 1fr;
  }
}
</style>