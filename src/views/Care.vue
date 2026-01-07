<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Star, Share, More, Plus, Loading } from '@element-plus/icons-vue'
import { getFollowings, getUserShares, likeShare, unlikeShare, checkLikeStatus, getTopUsers, followUser, unfollowUser, checkFollowStatus } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 动态数据
const userActivities = ref([])
const loading = ref(false)

// 推荐用户数据
const recommendedUsers = ref([])

// 加载热门用户
const loadTopUsers = async () => {
  try {
    const users = await getTopUsers(5)
    console.log('热门用户:', users)
    
    // 确保 users 是数组
    if (!users || !Array.isArray(users) || users.length === 0) {
      recommendedUsers.value = []
      return
    }
    
    // 检查关注状态
    const usersWithStatus = []
    for (const user of users) {
      let isFollowing = false
      try {
        isFollowing = await checkFollowStatus(user.id) === true
      } catch (e) {
        // 未登录或其他错误
      }
      usersWithStatus.push({
        id: user.id,
        name: user.nickname || '用户',
        avatar: user.avatar || 'https://via.placeholder.com/40',
        bio: user.bio || '这个用户很懒，什么都没写~',
        isFollowing: isFollowing
      })
    }
    recommendedUsers.value = usersWithStatus
  } catch (error) {
    console.error('加载热门用户失败:', error)
    recommendedUsers.value = []
  }
}

// 关注/取消关注推荐用户
const toggleFollow = async (user) => {
  try {
    if (user.isFollowing) {
      const res = await unfollowUser(user.id)
      if (res.code === 200) {
        user.isFollowing = false
        ElMessage.success('已取消关注')
        // 刷新动态列表
        loadFollowingActivities()
      }
    } else {
      const res = await followUser(user.id)
      if (res.code === 200) {
        user.isFollowing = true
        ElMessage.success('关注成功')
        // 刷新动态列表
        loadFollowingActivities()
      }
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 加载关注用户的动态
const loadFollowingActivities = async () => {
  loading.value = true
  try {
    // 1. 获取关注列表
    const followings = await getFollowings()
    console.log('关注列表:', followings)
    
    if (!followings || followings.length === 0) {
      userActivities.value = []
      return
    }
    
    // 2. 获取每个关注用户的分享
    const allActivities = []
    for (const user of followings) {
      try {
        const shares = await getUserShares(user.id)
        if (shares && shares.length > 0) {
          for (const share of shares) {
            // 检查点赞状态
            let isLiked = false
            try {
              isLiked = await checkLikeStatus(share.id) === true
            } catch (e) {
              // 未登录或其他错误，默认未点赞
            }
            
            allActivities.push({
              id: share.id,
              userId: user.id,
              userName: user.nickname || '用户',
              userAvatar: user.avatar || 'https://via.placeholder.com/40',
              rawTime: share.createdAt,
              time: formatTime(share.createdAt),
              content: share.content || '',
              music: {
                id: share.musicId,
                name: share.musicTitle || '未知歌曲',
                artist: share.musicArtist || '未知艺人',
                cover: share.musicCover || 'https://via.placeholder.com/60',
                duration: formatDuration(share.duration || 0)
              },
              likes: share.likedCount || 0,
              comments: share.commentCount || 0,
              isLiked: isLiked
            })
          }
        }
      } catch (e) {
        console.error(`获取用户 ${user.id} 的分享失败:`, e)
      }
    }
    
    // 3. 按时间排序，最新的在前面
    allActivities.sort((a, b) => {
      return new Date(b.rawTime) - new Date(a.rawTime)
    })
    
    userActivities.value = allActivities
    console.log('加载到的动态:', allActivities.length)
  } catch (error) {
    console.error('加载关注动态失败:', error)
    ElMessage.error('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '刚刚'
  const time = new Date(timeString)
  const now = new Date()
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.toLocaleDateString()
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 点赞/取消点赞
const toggleLike = async (activity) => {
  try {
    if (activity.isLiked) {
      const res = await unlikeShare(activity.id)
      if (res.code === 200) {
        activity.isLiked = false
        activity.likes--
      }
    } else {
      const res = await likeShare(activity.id)
      if (res.code === 200) {
        activity.isLiked = true
        activity.likes++
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  }
}

const playMusic = (music) => {
  console.log('播放音乐:', music.name)
}

const viewUserProfile = (user) => {
  router.push(`/user/${user.id}`)
}

const goToShareDetail = (shareId) => {
  router.push(`/share/${shareId}`)
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

onMounted(() => {
  loadFollowingActivities()
  loadTopUsers()
})
</script>

<template>
  <div class="follow-page">
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
              
              <!-- 加载中 -->
              <div v-if="loading" class="loading-state">
                <el-icon class="is-loading" :size="24"><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              
              <!-- 空状态 -->
              <div v-else-if="userActivities.length === 0" class="empty-state">
                <p>还没有关注的用户动态</p>
                <el-button type="primary" @click="router.push('/hot')">去发现更多</el-button>
              </div>
              
              <div v-else class="activities-list">
                <div
                  v-for="activity in userActivities"
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-header">
                    <div class="user-info" @click="router.push(`/user/${activity.userId}`)">
                      <el-avatar :size="40" :src="activity.userAvatar" />
                      <div class="user-details">
                        <h4 class="user-name">{{ activity.userName }}</h4>
                        <span class="activity-time">{{ activity.time }}</span>
                      </div>
                    </div>
                    <el-button type="primary" link :icon="More" />
                  </div>

                  <div class="activity-content" @click="goToShareDetail(activity.id)">
                    <p class="activity-text">{{ activity.content }}</p>
                    
                    <div class="music-card">
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
                      @click="goToShareDetail(activity.id)"
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
            
            <div v-if="recommendedUsers.length === 0" class="empty-recommend">
              <p>暂无推荐用户</p>
            </div>
            
            <div v-else class="recommended-users">
              <div
                v-for="user in recommendedUsers"
                :key="user.id"
                class="recommended-user"
              >
                <div class="user-main" @click="router.push(`/user/${user.id}`)">
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
  background-color: #fffdf8;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1400px;
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
  max-width: 1400px;
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

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  gap: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-bottom: 16px;
  font-size: 16px;
}

.empty-recommend {
  text-align: center;
  padding: 20px;
  color: #999;
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
  background: #fffdf8;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.music-card:hover {
  background: #f5ebe8;
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
  background: #fffdf8;
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