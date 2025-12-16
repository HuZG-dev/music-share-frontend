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


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  VideoPlay, View, ArrowRight
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
const recommendedShares = ref([
  {
    id: 1,
    musicName: '精选华语流行',
    artist: '华语乐坛精选',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '音乐精选官',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 1234567,
    duration: '未知时长',
    musicId: '1842728629',
    url: ''
  },
  {
    id: 2,
    musicName: '经典英文老歌',
    artist: '欧美经典',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23764ba2' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '老歌回忆录',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 891234,
    duration: '未知时长',
    musicId: '1838868183',
    url: ''
  },
  {
    id: 3,
    musicName: '热门电音派对',
    artist: '电音狂欢',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f093fb' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '电音小助手',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 567890,
    duration: '未知时长',
    musicId: '1839237849',
    url: ''
  },
  {
    id: 4,
    musicName: '治愈系轻音乐',
    artist: '放松身心',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%234ecdc4' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '治愈系音乐',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 456789,
    duration: '未知时长',
    musicId: '1837654283',
    url: ''
  },
  {
    id: 5,
    musicName: '摇滚经典合集',
    artist: '摇滚传奇',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f7b801' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '摇滚不死',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 345678,
    duration: '未知时长',
    musicId: '1836723845',
    url: ''
  },
  {
    id: 6,
    musicName: '中国风精选',
    artist: '国韵飘香',
    cover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%239775fa' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
    userName: '中国风音乐',
    userAvatar: '/src/assets/default-avatar.png',
    playCount: 234567,
    duration: '未知时长',
    musicId: '1835428937',
    url: ''
  }
])

// 获取推荐分享数据
const fetchRecommendedShares = async () => {
  try {
    console.log('开始获取推荐分享数据...')
    const response = await fetchAllShares()
    console.log('后端返回的原始数据:', response)
    
    // 如果数据为空或数据不足，保持使用默认的模拟数据
    if (!response || !Array.isArray(response) || response.length === 0) {
      console.log('数据库为空，使用默认模拟数据')
      return
    }
    
    // 确保只使用前6个数据
    const limitedResponse = response.slice(0, 6)
    console.log('处理的分享数据:', limitedResponse)
    
    // 使用 Promise.all 批量获取音乐封面
    const sharesWithCovers = await Promise.all(
      limitedResponse.map(async (item) => {
        let coverUrl = item.musicCover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E"
        console.log(`处理分享 ${item.id}: ${item.musicTitle} - ${item.musicArtist}, musicId: ${item.musicId}`)
        
        // 如果有 musicId，通过网易云 API 获取封面
        if (item.musicId) {
          try {
            console.log(`调用网易云 API 获取音乐 ${item.musicId} 详情...`)
            const musicDetail = await getMusicDetail(String(item.musicId))
            console.log(`网易云 API 返回结果:`, musicDetail)
            
            if (musicDetail && musicDetail.pic) {
              coverUrl = musicDetail.pic
              console.log(`获取到封面 URL: ${coverUrl}`)
            } else {
              console.log(`未获取到有效的封面 URL`)
            }
          } catch (error) {
            console.error(`获取音乐 ${item.musicId} 封面失败:`, error)
            // 失败时使用默认封面
          }
        } else {
          console.log(`该分享没有 musicId`)
        }
        
        return {
          id: item.id,
          musicName: item.musicTitle,
          artist: item.musicArtist,
          cover: coverUrl,
          userName: item.user?.nickname || '未知用户',
          userAvatar: item.user?.avatar || '/src/assets/default-avatar.png',
          playCount: item.likedCount || 0,
          duration: '未知时长',
          musicId: item.musicId
        }
      })
    )
    
    console.log('最终处理后的分享数据:', sharesWithCovers)
    recommendedShares.value = sharesWithCovers
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
  },
  {
    id: 1006,
    musicName: '夜曲',
    artist: '周杰伦',
    playCount: 4321098
  },
  {
    id: 1007,
    musicName: '平凡之路',
    artist: '朴树',
    playCount: 3210987
  },
  {
    id: 1008,
    musicName: '小幸运',
    artist: '田馥甄',
    playCount: 2109876
  },
  {
    id: 1009,
    musicName: '岁月神偷',
    artist: '金玟岐',
    playCount: 1098765
  },
  {
    id: 1010,
    musicName: '红色高跟鞋',
    artist: '蔡健雅',
    playCount: 987654
  }
])

// 获取热门分享数据
const fetchHotShares = async () => {
  try {
    const response = await getHotSongs(10)
    if (response && Array.isArray(response)) {
      // 确保只使用前10个数据
      const limitedResponse = response.slice(0, 10)
      // 将网易云音乐API返回的数据转换为我们需要的格式
      hotShares.value = limitedResponse.map((item, index) => ({
        id: index + 1001,
        musicName: item.name,
        artist: item.artist || '未知艺术家',
        playCount: Math.floor(Math.random() * 10000000) + 5000000
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



// 方法
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

const filterByCategory = (categoryId) => {
  console.log('筛选分类:', categoryId)
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-button {
  font-size: 14px;
  color: #42b983;
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