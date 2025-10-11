<template>
  <div class="home">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索音乐、歌手或分享内容..."
          size="large"
          class="search-input"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容 -->
      <div class="content-left">
        <!-- 推荐分享 -->
        <section class="section">
          <div class="section-header">
            <h2>🎵 推荐分享</h2>
            <router-link to="/recommend" class="more-link">更多</router-link>
          </div>
          <div class="share-list">
            <div v-for="share in recommendedShares" :key="share.id" class="share-card">
              <div class="share-cover">
                <img :src="share.cover" :alt="share.musicName" />
                <div class="play-overlay" @click="playMusic(share)">
                  <el-icon size="24"><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="share-info">
                <h4 class="music-name">{{ share.musicName }}</h4>
                <p class="artist">{{ share.artist }}</p>
                <p class="content">{{ share.content }}</p>
                <div class="share-meta">
                  <span class="user">
                    <el-avatar :size="20" :src="share.userAvatar" />
                    {{ share.userName }}
                  </span>
                  <div class="actions">
                    <span class="action-item">
                      <el-icon><Star /></el-icon>
                      {{ share.likeCount }}
                    </span>
                    <span class="action-item">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ share.commentCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门分享 -->
        <section class="section">
          <div class="section-header">
            <h2>🔥 热门分享</h2>
            <router-link to="/hot" class="more-link">更多</router-link>
          </div>
          <div class="hot-list">
            <div v-for="(share, index) in hotShares" :key="share.id" class="hot-item">
              <span class="rank" :class="getRankClass(index)">{{ index + 1 }}</span>
              <div class="hot-info">
                <h4>{{ share.musicName }}</h4>
                <p>{{ share.artist }} · {{ share.userName }}</p>
              </div>
              <span class="hot-count">{{ share.playCount }} 播放</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <!-- 用户信息卡片 -->
        <div v-if="isLoggedIn" class="user-card">
          <div class="user-header">
            <el-avatar :size="50" :src="userAvatar" />
            <div class="user-details">
              <h4>{{ userNickname }}</h4>
              <p>欢迎回来！</p>
            </div>
          </div>
          <el-button type="primary" class="share-btn" @click="goToShare">
            <el-icon><Plus /></el-icon>
            分享音乐
          </el-button>
        </div>
        <div v-else class="guest-card">
          <h4>发现好音乐</h4>
          <p>登录后获取个性化推荐</p>
          <router-link to="/login">
            <el-button type="primary">立即登录</el-button>
          </router-link>
        </div>

        <!-- 音乐分类 -->
        <div class="category-card">
          <h4>🎶 音乐分类</h4>
          <div class="category-list">
            <span 
              v-for="category in categories" 
              :key="category.id"
              class="category-tag"
              @click="filterByCategory(category.id)"
            >
              {{ category.name }}
            </span>
          </div>
        </div>

        <!-- 最新动态 -->
        <div class="activity-card">
          <h4>📢 最新动态</h4>
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <el-avatar :size="30" :src="activity.userAvatar" />
              <div class="activity-content">
                <p><strong>{{ activity.userName }}</strong> {{ activity.action }}</p>
                <span class="activity-time">{{ activity.time }}</span>
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
  Search, VideoPlay, Star, ChatDotRound, Plus 
} from '@element-plus/icons-vue'

const router = useRouter()

// 搜索相关
const searchKeyword = ref('')

// 用户状态
const isLoggedIn = ref(false)
const userNickname = ref('')
const userAvatar = ref('')

// 模拟数据
const recommendedShares = ref([
  {
    id: 1,
    musicName: '晴天',
    artist: '周杰伦',
    cover: 'https://via.placeholder.com/120x120',
    content: '这首歌让我想起了校园时光，每次听都有不同的感受...',
    userName: '音乐爱好者',
    userAvatar: 'https://via.placeholder.com/40x40',
    likeCount: 234,
    commentCount: 56,
    playCount: 12345
  },
  {
    id: 2,
    musicName: '起风了',
    artist: '买辣椒也用券',
    cover: 'https://via.placeholder.com/120x120',
    content: '青春的味道，每次听都让人热泪盈眶',
    userName: '风中的歌者',
    userAvatar: 'https://via.placeholder.com/40x40',
    likeCount: 189,
    commentCount: 42,
    playCount: 9876
  }
])

const hotShares = ref([
  { id: 1, musicName: '孤勇者', artist: '陈奕迅', userName: '英雄联盟', playCount: 45678 },
  { id: 2, musicName: '光年之外', artist: 'G.E.M.邓紫棋', userName: '星空观察员', playCount: 38976 },
  { id: 3, musicName: '稻香', artist: '周杰伦', userName: '田园诗人', playCount: 34567 },
  { id: 4, musicName: '少年', artist: '梦然', userName: '追梦人', playCount: 29876 },
  { id: 5, musicName: '星辰大海', artist: '黄霄雲', userName: '宇航员', playCount: 26789 }
])

const categories = ref([
  { id: 1, name: '流行' },
  { id: 2, name: '摇滚' },
  { id: 3, name: '民谣' },
  { id: 4, name: '电子' },
  { id: 5, name: '古典' },
  { id: 6, name: '爵士' },
  { id: 7, name: 'R&B' },
  { id: 8, name: '嘻哈' }
])

const activities = ref([
  { id: 1, userName: '小美', userAvatar: 'https://via.placeholder.com/30x30', action: '分享了《海底》', time: '2分钟前' },
  { id: 2, userName: '音乐达人', userAvatar: 'https://via.placeholder.com/30x30', action: '点赞了你的分享', time: '5分钟前' },
  { id: 3, userName: '旋律猎人', userAvatar: 'https://via.placeholder.com/30x30', action: '关注了你', time: '10分钟前' }
])

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const playMusic = (share) => {
  console.log('播放音乐:', share.musicName)
  // 这里会调用播放器组件
}

const getRankClass = (index) => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const goToShare = () => {
  router.push('/share/create')
}

const filterByCategory = (categoryId) => {
  console.log('筛选分类:', categoryId)
}

// 初始化
onMounted(() => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  
  isLoggedIn.value = !!token
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      userNickname.value = user.nickname || '用户'
      userAvatar.value = user.avatar || 'https://via.placeholder.com/50x50'
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 搜索区域 */
.search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px 20px;
  margin-bottom: 30px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  border-radius: 8px;
  overflow: hidden;
}

/* 主要内容布局 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

/* 区块通用样式 */
.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.more-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

/* 分享卡片 */
.share-list {
  display: grid;
  gap: 20px;
}

.share-card {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.share-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.share-cover {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 16px;
}

.share-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.share-cover:hover .play-overlay {
  opacity: 1;
}

.share-info {
  flex: 1;
}

.music-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.artist {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.content {
  margin: 0 0 16px 0;
  color: #555;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.share-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

/* 热门列表 */
.hot-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.hot-item:hover {
  background-color: #f8f9fa;
}

.hot-item:last-child {
  border-bottom: none;
}

.rank {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.rank-1 {
  background: #ffd700;
  color: #fff;
}

.rank-2 {
  background: #c0c0c0;
  color: #fff;
}

.rank-3 {
  background: #cd7f32;
  color: #fff;
}

.hot-info {
  flex: 1;
}

.hot-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.hot-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.hot-count {
  font-size: 12px;
  color: #999;
}

/* 侧边栏卡片 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card, .guest-card, .category-card, .activity-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-details h4 {
  margin: 0 0 4px 0;
  color: #333;
}

.user-details p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.share-btn {
  width: 100%;
}

.guest-card h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.guest-card p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.category-card h4, .activity-card h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 6px 12px;
  background: #f0f2f5;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tag:hover {
  background: #667eea;
  color: white;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .share-card {
    flex-direction: column;
  }
  
  .share-cover {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 12px;
  }
}
</style>