<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Star, Share, More, Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 关注用户数据
const followedUsers = ref([
  {
    id: 1,
    name: '音乐达人小张',
    avatar: 'https://via.placeholder.com/60x60/667eea/ffffff',
    bio: '专注分享好音乐，每天更新',
    isFollowing: true,
    followers: '12.3万',
    shares: 456,
    isOnline: true,
    lastActive: '刚刚'
  },
  {
    id: 2,
    name: '旋律猎人',
    avatar: 'https://via.placeholder.com/60x60/764ba2/ffffff',
    bio: '寻找最美旋律的音乐探索者',
    isFollowing: true,
    followers: '8.7万',
    shares: 321,
    isOnline: false,
    lastActive: '2小时前'
  },
  {
    id: 3,
    name: '节奏大师',
    avatar: 'https://via.placeholder.com/60x60/f093fb/ffffff',
    bio: '节奏感才是音乐的灵魂',
    isFollowing: true,
    followers: '6.5万',
    shares: 234,
    isOnline: true,
    lastActive: '在线'
  },
  {
    id: 4,
    name: '和声之美',
    avatar: 'https://via.placeholder.com/60x60/4ecdc4/ffffff',
    bio: '专注于和声研究的音乐人',
    isFollowing: true,
    followers: '5.2万',
    shares: 198,
    isOnline: false,
    lastActive: '1天前'
  }
])

// 动态数据
const userActivities = ref([
  {
    id: 1,
    userId: 1,
    userName: '音乐达人小张',
    userAvatar: 'https://via.placeholder.com/40x40/667eea/ffffff',
    type: 'share',
    content: '分享了歌曲',
    music: {
      id: 1,
      name: '晴天',
      artist: '周杰伦',
      cover: 'https://via.placeholder.com/80x80/667eea/ffffff',
      duration: '04:30'
    },
    time: '2分钟前',
    likes: 123,
    comments: 45,
    isLiked: false
  },
  {
    id: 2,
    userId: 2,
    userName: '旋律猎人',
    userAvatar: 'https://via.placeholder.com/40x40/764ba2/ffffff',
    type: 'share',
    content: '发现了一首宝藏歌曲',
    music: {
      id: 2,
      name: '起风了',
      artist: '买辣椒也用券',
      cover: 'https://via.placeholder.com/80x80/764ba2/ffffff',
      duration: '03:45'
    },
    time: '1小时前',
    likes: 89,
    comments: 23,
    isLiked: true
  },
  {
    id: 3,
    userId: 3,
    userName: '节奏大师',
    userAvatar: 'https://via.placeholder.com/40x40/f093fb/ffffff',
    type: 'like',
    content: '点赞了歌曲',
    music: {
      id: 3,
      name: '海底',
      artist: '一支榴莲',
      cover: 'https://via.placeholder.com/80x80/f093fb/ffffff',
      duration: '03:20'
    },
    time: '3小时前',
    likes: 67,
    comments: 12,
    isLiked: false
  },
  {
    id: 4,
    userId: 4,
    userName: '和声之美',
    userAvatar: 'https://via.placeholder.com/40x40/4ecdc4/ffffff',
    type: 'share',
    content: '推荐一首适合学习的轻音乐',
    music: {
      id: 4,
      name: '星空',
      artist: '纯音乐',
      cover: 'https://via.placeholder.com/80x80/4ecdc4/ffffff',
      duration: '05:15'
    },
    time: '5小时前',
    likes: 156,
    comments: 34,
    isLiked: false
  },
  {
    id: 5,
    userId: 1,
    userName: '音乐达人小张',
    userAvatar: 'https://via.placeholder.com/40x40/667eea/ffffff',
    type: 'share',
    content: '今日推荐：经典老歌回顾',
    music: {
      id: 5,
      name: '夜曲',
      artist: '周杰伦',
      cover: 'https://via.placeholder.com/80x80/667eea/ffffff',
      duration: '04:20'
    },
    time: '1天前',
    likes: 234,
    comments: 67,
    isLiked: true
  }
])

// 推荐用户数据
const recommendedUsers = ref([
  {
    id: 5,
    name: '电子音乐人',
    avatar: 'https://via.placeholder.com/60x60/ff6b6b/ffffff',
    bio: '电子音乐制作与分享',
    isFollowing: false,
    followers: '3.2万',
    shares: 187,
    isOnline: true
  },
  {
    id: 6,
    name: '民谣诗人',
    avatar: 'https://via.placeholder.com/60x60/45b7d1/ffffff',
    bio: '用音乐讲述故事',
    isFollowing: false,
    followers: '4.1万',
    shares: 213,
    isOnline: false
  },
  {
    id: 7,
    name: '古典乐迷',
    avatar: 'https://via.placeholder.com/60x60/96ceb4/ffffff',
    bio: '古典音乐爱好者',
    isFollowing: false,
    followers: '2.8万',
    shares: 165,
    isOnline: true
  }
])

// 方法
const toggleFollow = (user) => {
  user.isFollowing = !user.isFollowing
}

const toggleLike = (activity) => {
  activity.isLiked = !activity.isLiked
  activity.likes += activity.isLiked ? 1 : -1
}

const playMusic = (music) => {
  console.log('播放音乐:', music.name)
}

const viewUserProfile = (user) => {
  router.push(`/user/${user.id}`)
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

onMounted(() => {
  // 初始化代码
})
</script>

<template>
  <div class="follow-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">我的关注</h1>
        <p class="page-subtitle">关注用户的最新动态和分享</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 左侧内容 -->
        <div class="content-left">
          <!-- 最新动态 -->
          <div class="activities-section">
            <div class="section">
              <div class="section-header">
                <h3 class="section-title">最新动态</h3>
                <span class="activities-count">共 {{ userActivities.length }} 条动态</span>
              </div>
              
              <div class="activities-list">
                <div
                  v-for="activity in userActivities"
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-header">
                    <div class="user-info" @click="viewUserProfile(activity)">
                      <el-avatar :size="40" :src="activity.userAvatar" />
                      <div class="user-details">
                        <h4 class="user-name">{{ activity.userName }}</h4>
                        <span class="activity-time">{{ activity.time }}</span>
                      </div>
                    </div>
                    <el-button type="primary" link :icon="More" />
                  </div>

                  <div class="activity-content">
                    <p class="activity-text">{{ activity.content }}</p>
                    
                    <div class="music-card" @click="playMusic(activity.music)">
                      <div class="music-cover">
                        <img :src="activity.music.cover" :alt="activity.music.name" />
                        <div class="cover-overlay">
                          <el-icon size="20"><VideoPlay /></el-icon>
                        </div>
                      </div>
                      <div class="music-info">
                        <h5 class="music-name">{{ activity.music.name }}</h5>
                        <p class="music-artist">{{ activity.music.artist }}</p>
                        <span class="music-duration">{{ activity.music.duration }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="activity-actions">
                    <el-button 
                      :icon="Star" 
                      :type="activity.isLiked ? 'primary' : ''"
                      @click="toggleLike(activity)"
                      class="action-btn"
                    >
                      {{ formatCount(activity.likes) }}
                    </el-button>
                    <el-button 
                      :icon="Share"
                      class="action-btn"
                    >
                      {{ formatCount(activity.comments) }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="sidebar">
          <!-- 推荐关注 -->
          <div class="section">
            <div class="section-header">
              <h4 class="section-title">推荐关注</h4>
            </div>
            
            <div class="recommended-users">
              <div
                v-for="user in recommendedUsers"
                :key="user.id"
                class="recommended-user"
              >
                <div class="user-main" @click="viewUserProfile(user)">
                  <el-avatar :size="40" :src="user.avatar" />
                  <div class="user-info">
                    <h5 class="user-name">{{ user.name }}</h5>
                    <p class="user-bio">{{ user.bio }}</p>
                  </div>
                </div>
                
                <el-button 
                  size="small" 
                  :type="user.isFollowing ? '' : 'primary'"
                  @click="toggleFollow(user)"
                  class="follow-btn"
                >
                  <el-icon v-if="!user.isFollowing"><Plus /></el-icon>
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 快速导航 -->
          <div class="section">
            <div class="section-header">
              <h4 class="section-title">发现更多</h4>
            </div>
            
            <div class="quick-nav">
              <el-button 
                type="primary" 
                link 
                @click="router.push('/hot')"
                class="nav-item"
              >
                🔥 热门音乐
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="router.push('/categories')"
                class="nav-item"
              >
                🎵 音乐分类
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="router.push('/recommend')"
                class="nav-item"
              >
                💫 每日推荐
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.follow-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

/* 通用区块样式 */
.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.activities-count {
  font-size: 14px;
  color: #666;
}

/* 动态列表 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #e8f4ff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

.activity-content {
  margin-bottom: 16px;
}

.activity-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.music-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.music-card:hover {
  background: #e9ecef;
}

.music-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.music-card:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay .el-icon {
  color: white;
}

.music-info {
  flex: 1;
}

.music-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.music-artist {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #666;
}

.music-duration {
  font-size: 12px;
  color: #999;
}

.activity-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border-radius: 16px;
  padding: 6px 16px;
}

/* 推荐用户 */
.recommended-users {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommended-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.recommended-user:hover {
  border-color: #e8f4ff;
}

.recommended-user .user-main {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.recommended-user .user-info {
  flex: 1;
}

.recommended-user .user-name {
  font-size: 14px;
  margin-bottom: 2px;
}

.recommended-user .user-bio {
  font-size: 12px;
  margin: 0;
  color: #666;
}

.recommended-user .follow-btn {
  padding: 6px 12px;
  min-width: 70px;
  border-radius: 16px;
}

/* 快速导航 */
.quick-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  justify-content: flex-start;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .section {
    padding: 16px;
    border-radius: 8px;
  }
  
  .activity-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .music-card {
    flex-direction: column;
    text-align: center;
  }
  
  .music-cover {
    align-self: center;
  }
}

@media (max-width: 480px) {
  .activity-actions {
    justify-content: center;
  }
  
  .recommended-user {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .recommended-user .user-main {
    flex-direction: column;
    text-align: center;
  }
}
</style>