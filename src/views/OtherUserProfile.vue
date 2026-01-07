<template>
  <div class="profile-container">
    <!-- 顶部用户信息区 -->
    <div class="profile-header">
      <div class="user-info-section">
        <!-- 头像 -->
        <div class="avatar-container">
          <img :src="userInfo.avatar || defaultAvatar" alt="头像" class="user-avatar">
        </div>
        <!-- 用户基本信息 -->
        <div class="user-details">
          <h1 class="username">{{ userInfo.nickname || '用户' }}</h1>
          <!-- 关注、粉丝、获赞 -->
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">{{ followingCount }}</span>
              <span class="stat-label">关注</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ followerCount }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalLikes }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
          
          <!-- 个性签名和关注按钮 -->
          <div class="bio-section">
            <div class="bio">{{ userInfo.bio || '暂无个性签名' }}</div>
            <el-button type="primary" @click="handleFollow">
              {{ isFollowing ? '已关注' : '关注' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间导航栏 -->
    <div class="profile-nav">
      <div 
        class="nav-item" 
        :class="{ active: currentNav === 'works' }" 
        @click="switchNav('works')"
      >
        作品 <span v-if="currentNav === 'works'" class="nav-count">{{ shares.length }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentNav === 'followings' }" 
        @click="switchNav('followings')"
      >
        关注 <span v-if="currentNav === 'followings'" class="nav-count">{{ followings.length }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentNav === 'followers' }" 
        @click="switchNav('followers')"
      >
        粉丝 <span v-if="currentNav === 'followers'" class="nav-count">{{ followers.length }}</span>
      </div>
    </div>

    <!-- 作品列表 -->
    <div class="works-container">
      <!-- 作品内容 -->
      <div v-if="currentNav === 'works'">
        <div v-if="shares.length === 0" class="empty-works">
          <i class="el-icon-folder-opened"></i>
          <p>暂无作品</p>
        </div>
        
        <!-- 分享列表 -->
        <div v-else class="shares-grid">
          <div v-for="share in shares" :key="share.id" class="share-card" @click="goToShareDetail(share.id)">
            <!-- 音乐封面 -->
            <div class="share-cover">
              <img :src="share.musicInfo.cover" :alt="share.musicInfo.title" class="cover-image">
              <div class="cover-overlay">
                <i class="el-icon-video-play"></i>
              </div>
              <!-- 互动数据 -->
              <div class="interaction-overlay">
                <div class="interaction-item">
                  <i class="el-icon-star-off"></i>
                  <span>{{ share.likes }}</span>
                </div>
                <div class="interaction-item">
                  <i class="el-icon-chat-dot-round"></i>
                  <span>{{ share.comments }}</span>
                </div>
              </div>
            </div>
            
            <!-- 分享内容 -->
            <div class="share-content">
              <h3 class="music-title">{{ share.musicInfo.title }}</h3>
              <p class="music-artist">{{ share.musicInfo.artist }}</p>
              <p class="content-text">{{ share.content }}</p>
              
              <!-- 标签 -->
              <div class="share-tags" v-if="share.tags.length > 0">
                <el-tag 
                  v-for="tag in share.tags" 
                  :key="tag" 
                  size="small" 
                  class="content-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              
              <!-- 发布时间 -->
              <div class="share-time">
                <i class="el-icon-clock"></i>
                <span>{{ formatTime(share.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 关注列表 -->
      <div v-else-if="currentNav === 'followings'">
        <div v-if="followings.length === 0" class="empty-works">
          <i class="el-icon-user"></i>
          <p>暂无关注的用户</p>
        </div>
        
        <div v-else class="users-grid">
          <div v-for="user in followings" :key="user.id" class="user-card" @click="goToUserProfile(user.id)">
            <el-avatar :size="80" :src="user.avatar || 'https://via.placeholder.com/80'" />
            <h3 class="user-nickname">{{ user.nickname }}</h3>
            <p class="user-phone">{{ user.phone }}</p>
          </div>
        </div>
      </div>
      
      <!-- 粉丝列表 -->
      <div v-else-if="currentNav === 'followers'">
        <div v-if="followers.length === 0" class="empty-works">
          <i class="el-icon-user"></i>
          <p>暂无粉丝</p>
        </div>
        
        <div v-else class="users-grid">
          <div v-for="user in followers" :key="user.id" class="user-card" @click="goToUserProfile(user.id)">
            <el-avatar :size="80" :src="user.avatar || 'https://via.placeholder.com/80'" />
            <h3 class="user-nickname">{{ user.nickname }}</h3>
            <p class="user-phone">{{ user.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { getUserInfo, getUserShares, getUserFollowings, getUserFollowers, getFollowingCount, getFollowerCount, followUser, unfollowUser, checkFollowStatus } from '@/api'

export default {
  name: 'OtherUserProfile',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userId = ref(route.params.id)

    const defaultAvatar = '/default-avatar.png'
    
    // 用户信息
    const userInfo = ref({
      id: '',
      nickname: '',
      avatar: '',
      bio: ''
    })

    // 导航状态
    const currentNav = ref('works')
    
    // 分享列表数据
    const shares = ref([])
    const followings = ref([])
    const followers = ref([])
    
    // 统计数据
    const followingCount = ref(0)
    const followerCount = ref(0)
    const totalLikes = ref(0)
    const isFollowing = ref(false)
    
    // 切换导航
    const switchNav = async (navType) => {
      currentNav.value = navType
      if (navType === 'followings') {
        await loadFollowings()
      } else if (navType === 'followers') {
        await loadFollowers()
      }
    }

    // 加载用户信息
    const loadUserInfo = async () => {
      try {
        const data = await getUserInfo(userId.value)
        userInfo.value = data
      } catch (error) {
        console.error('加载用户信息失败:', error)
        ElMessage.error('加载用户信息失败')
      }
    }

    // 加载用户分享
    const loadShares = async () => {
      try {
        const sharesData = await getUserShares(userId.value)
        
        shares.value = sharesData.map(share => ({
          id: share.id,
          musicInfo: {
            id: share.musicId,
            title: share.musicTitle,
            artist: share.musicArtist,
            album: share.musicAlbum,
            cover: share.musicCover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
            duration: 0,
            source: 'qqmusic'
          },
          content: share.content,
          tags: share.tags ? share.tags.split(',') : [],
          privacy: share.privacy || 'public',
          status: 'normal',
          likes: share.likedCount || 0,
          comments: 0,
          shares: share.sharedCount || 0,
          createdAt: share.createdAt
        }))
      } catch (error) {
        console.error('加载分享失败:', error)
        ElMessage.error('加载分享失败')
      }
    }
    
    // 加载关注列表
    const loadFollowings = async () => {
      try {
        const followingsData = await getUserFollowings(userId.value)
        followings.value = followingsData
      } catch (error) {
        console.error('加载关注列表失败:', error)
        ElMessage.error('加载关注列表失败')
      }
    }
    
    // 加载粉丝列表
    const loadFollowers = async () => {
      try {
        const followersData = await getUserFollowers(userId.value)
        followers.value = followersData
      } catch (error) {
        console.error('加载粉丝列表失败:', error)
        ElMessage.error('加载粉丝列表失败')
      }
    }
    
    // 加载统计数据
    const loadStats = async () => {
      try {
        // 获取关注数
        const followingCountData = await getFollowingCount(userId.value)
        followingCount.value = followingCountData
        
        // 获取粉丝数
        const followerCountData = await getFollowerCount(userId.value)
        followerCount.value = followerCountData
        
        // 计算总获赞数
        if (shares.value.length > 0) {
          totalLikes.value = shares.value.reduce((sum, share) => sum + (share.likes || 0), 0)
        }
        
        // 检查关注状态
        try {
          const status = await checkFollowStatus(userId.value)
          isFollowing.value = status === true
        } catch (e) {
          console.error('检查关注状态失败:', e)
          isFollowing.value = false
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }
    
    // 关注/取消关注
    const handleFollow = async () => {
      try {
        if (isFollowing.value) {
          const res = await unfollowUser(userId.value)
          if (res.code === 200) {
            isFollowing.value = false
            followerCount.value--
            ElMessage.success('已取消关注')
          } else {
            ElMessage.error(res.message || '取消关注失败')
          }
        } else {
          const res = await followUser(userId.value)
          if (res.code === 200) {
            isFollowing.value = true
            followerCount.value++
            ElMessage.success('关注成功')
          } else {
            ElMessage.error(res.message || '关注失败')
          }
        }
      } catch (error) {
        console.error('关注操作失败:', error)
        ElMessage.error('操作失败，请重试')
      }
    }
    
    // 跳转到分享详情
    const goToShareDetail = (shareId) => {
      router.push(`/share/${shareId}`)
    }
    
    // 跳转到用户主页
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
    }

    // 格式化时间
    const formatTime = (timeString) => {
      const time = new Date(timeString)
      const now = new Date()
      const diff = now - time
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 60) {
        return `${minutes}分钟前`
      } else if (hours < 24) {
        return `${hours}小时前`
      } else if (days < 7) {
        return `${days}天前`
      } else {
        return time.toLocaleDateString()
      }
    }

    onMounted(async () => {
      await loadUserInfo()
      await loadShares()
      await loadStats()
    })

    return {
      userInfo,
      defaultAvatar,
      currentNav,
      switchNav,
      shares,
      followings,
      followers,
      followingCount,
      followerCount,
      totalLikes,
      isFollowing,
      handleFollow,
      goToShareDetail,
      goToUserProfile,
      formatTime
    }
  }
}
</script>

<style scoped>
/* 基础样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 深色主题配色 */
:root {
  --bg-primary: #000000;
  --bg-secondary: #181818;
  --text-primary: #ffffff;
  --text-secondary: #a8a8a8;
  --accent-color: #ff0050;
  --border-color: #333333;
  --hover-bg: #2a2a2a;
}

/* 页面容器 */
.profile-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部用户信息区 */
.profile-header {
  padding: 24px 0;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.user-info-section {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 头像样式 */
.avatar-container {
  position: relative;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--text-primary);
}

/* 用户详情 */
.user-details {
  flex: 1;
}

.username {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

/* 统计数据 */
.stats {
  display: flex;
  gap: 32px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 个性签名和按钮区域 */
.bio-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bio {
  flex: 1;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

/* 导航栏 */
.profile-nav {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 16px 0;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-item {
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.3s;
  position: relative;
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--text-primary);
  font-weight: 600;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-color);
}

.nav-count {
  margin-left: 4px;
  color: var(--accent-color);
}

/* 作品容器 */
.works-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* 空状态 */
.empty-works {
  text-align: center;
  padding: 48px 0;
  color: var(--text-secondary);
}

.empty-works i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 分享网格 */
.shares-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.share-card {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.share-cover {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
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

.share-card:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay i {
  font-size: 48px;
  color: white;
}

.interaction-overlay {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 12px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.share-content {
  padding: 12px;
}

.music-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-artist {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.share-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.content-tag {
  font-size: 11px;
}

.share-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

/* 用户卡片样式 */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.user-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.user-nickname {
  margin: 12px 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-phone {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
