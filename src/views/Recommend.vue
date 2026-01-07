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
              <el-button type="text" class="more-button" @click="viewMoreRecommendations">
                更多推荐 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <div class="share-grid">
              <ShareCard
                v-for="share in recommendedShares" 
                :key="share.id"
                :share="share"
                :on-click="handleShareCardClick"
                :cover-height="'160px'"
                :play-button-size="'48px'"
                :play-icon-size="24"
                :content-padding="'12px'"
              />
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
          
          <!-- 音乐播放器 -->
          <section class="section player-section" v-if="currentMusic.url">
            <Player :musicInfo="currentMusic" :autoplay="true" />
          </section>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 热门排行 -->
          <div class="ranking-card">
            <div class="card-header">
              <h4>热门排行</h4>
              <span class="more-link" @click="router.push('/hot')">更多</span>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(share, index) in hotShares" 
                :key="share.id" 
                class="ranking-item"
                @click="router.push(`/share/${share.id}`)"
              >
                <span :class="['ranking-order', getRankClass(index)]">{{ index + 1 }}</span>
                <div class="ranking-info">
                  <h5 class="line-clamp-1">{{ share.musicTitle }}</h5>
                  <p class="line-clamp-1">{{ share.musicArtist }}</p>
                </div>
                <span class="like-count"><el-icon><Star /></el-icon> {{ share.likedCount || 0 }}</span>
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
                @click="router.push(`/categories?cat=${category.name}`)"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
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
  VideoPlay, View, ArrowRight, Star
} from '@element-plus/icons-vue'
import { getBanners } from '../api/banner'
import { getRecommendedPlaylists, getHotSongs, getMusicDetail, getMusicUrl } from '../api/netease'
import { fetchAllShares } from '../api/index'
import ShareCard from '../components/ShareCard.vue'
import Player from '../components/Player.vue'

const router = useRouter()

// 当前播放的音乐信息
const currentMusic = ref({
  title: '',
  artist: '',
  cover: '',
  url: ''
})

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
const recommendedShares = ref([])

// 获取推荐分享数据
const fetchRecommendedShares = async () => {
  try {
    console.log('开始获取推荐分享...')
    const shares = await fetchAllShares()
    console.log('后端返回的分享数据:', shares)
    console.log('第一条分享的musicDuration:', shares[0]?.musicDuration)
    
    // 按创建时间倒序排列，最新的在前面
    const sortedShares = shares.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    console.log('排序后的分享数据:', sortedShares.slice(0, 6).map(s => ({id: s.id, createdAt: s.createdAt, duration: s.musicDuration})))
    
    // 转换数据格式以匹配ShareCard组件
    recommendedShares.value = sortedShares.slice(0, 6).map(share => {
      console.log('处理分享ID:', share.id, 'musicDuration:', share.musicDuration)
      // 使用后端保存的musicDuration
      let durationStr = '--:--' // 旧数据没有时长
      if (share.musicDuration && share.musicDuration > 0) {
        const minutes = Math.floor(share.musicDuration / 60)
        const seconds = share.musicDuration % 60
        durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
        console.log('计算出的时长字符串:', durationStr)
      } else {
        console.log('分享', share.id, '没有musicDuration数据')
      }
      
      return {
        id: share.id,
        cover: share.musicCover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
        musicName: share.musicTitle || '未知歌曲',
        artist: share.musicArtist || '未知艺术家',
        playCount: share.likedCount || 0,
        duration: durationStr,
        userAvatar: share.user?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23cccccc' width='32' height='32'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='white'%3E用户%3C/text%3E%3C/svg%3E",
        userName: share.user?.nickname || '匿名用户',
        musicId: share.musicId
      }
    })
    
    console.log('转换后的推荐分享数据:', recommendedShares.value)
  } catch (error) {
    console.error('获取推荐分享失败:', error)
    recommendedShares.value = []
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

// 热门分享数据（按点赞数排序）
const hotShares = ref([])

// 获取热门分享数据
const fetchHotShares = async () => {
  try {
    const shares = await fetchAllShares()
    // 按点赞数排序，取前10
    const sorted = [...shares].sort((a, b) => (b.likedCount || 0) - (a.likedCount || 0))
    hotShares.value = sorted.slice(0, 10)
  } catch (error) {
    console.error('获取热门分享失败:', error)
  }
}

const categories = ref([
  { id: 1, name: '流行', icon: '🎵' },
  { id: 2, name: '民谣', icon: '🌿' },
  { id: 3, name: 'R&B', icon: '🎶' },
  { id: 4, name: '说唱', icon: '🎤' },
  { id: 5, name: '摇滚', icon: '🎸' },
  { id: 6, name: '轻音', icon: '🎼' }
])

const filterByCategory = (categoryName) => {
  router.push(`/categories?cat=${categoryName}`)
}
const playMusic = async (share) => {
  console.log('播放音乐:', share.musicName)
  console.log('分享数据:', share)
  
  try {
    // 获取音乐播放URL
    console.log('获取音乐URL, musicId:', share.musicId)
    
    if (!share.musicId) {
      console.error('播放失败：没有musicId')
      return
    }
    
    const musicData = await getMusicUrl(share.musicId)
    console.log('获取到的音乐数据:', musicData)
    
    if (!musicData || !musicData.url) {
      console.error('播放失败：未获取到有效的音乐URL')
      return
    }
    
    // 更新当前播放的音乐信息
    currentMusic.value = {
      title: share.musicName,
      artist: share.artist,
      cover: share.cover,
      url: musicData.url
    }
    
    console.log('当前播放音乐:', currentMusic.value)
  } catch (error) {
    console.error('播放音乐失败:', error)
  }
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

const viewMoreRecommendations = () => {
  console.log('查看更多推荐')
  // 这里可以跳转到更多推荐页面
  router.push('/recommendations')
}

// 处理分享卡片点击事件，跳转到详情页
const handleShareCardClick = async (share) => {
  console.log('点击分享卡片:', share.id)
  
  // 播放音乐
  await playMusic(share)
  
  // 跳转到分享详情页
  router.push(`/share/${share.id}`)
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
  background-color: #fffdf8;
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
  background-color: #fffdf8;
  width: 100%;
  padding: 20px 0;
}

.main-content {
  max-width: 1400px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-button {
  font-size: 14px;
  color: #e07c5c;
  padding: 0;
  height: auto;
}

.more-button:hover {
  color: #369a70;
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

/* 推荐页分享卡片样式覆盖 */
.share-grid .music-title {
  font-size: 14px;
}

.share-grid .artist-name {
  font-size: 12px;
}

.share-grid .user-name {
  font-size: 12px;
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

.ranking-card, .category-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.card-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.more-link {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}

.more-link:hover {
  color: #e07c5c;
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
  background-color: #fffdf8;
}

.ranking-order {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f5ebe8;
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

.play-count, .like-count {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* 分类列表 */
.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-item {
  padding: 10px 12px;
  background: #fffdf8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.category-item:hover {
  background: #e07c5c;
  color: white;
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-size: 14px;
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