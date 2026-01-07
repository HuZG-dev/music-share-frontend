<template>
  <div class="profile-container">
    <!-- 顶部用户信息区 -->
    <div class="profile-header">
      <div class="user-info-section">
        <!-- 头像 -->
        <div class="avatar-container" @click="editAvatar">
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
          
          <!-- 个性签名 -->
          <div class="bio">{{ userInfo.bio || '暂无个性签名' }}</div>
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
        :class="{ active: currentNav === 'likes' }" 
        @click="switchNav('likes')"
      >
        喜欢 <span v-if="currentNav === 'likes'" class="nav-count">{{ likedShares.length }}</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentNav === 'collections' }" 
        @click="switchNav('collections')"
      >
        收藏 <span v-if="currentNav === 'collections'" class="nav-count">{{ collectedShares.length }}</span>
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
      
      <!-- 喜欢内容 -->
      <div v-else-if="currentNav === 'likes'">
        <div v-if="likedShares.length === 0" class="empty-works">
          <i class="el-icon-star-off"></i>
          <p>暂无喜欢的作品</p>
        </div>
        
        <div v-else class="shares-grid">
          <div v-for="share in likedShares" :key="share.id" class="share-card" @click="goToShareDetail(share.id)">
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
      
      <!-- 收藏内容 -->
      <div v-else-if="currentNav === 'collections'">
        <div v-if="collectedShares.length === 0" class="empty-works">
          <i class="el-icon-collection"></i>
          <p>暂无收藏的作品</p>
        </div>
        
        <div v-else class="shares-grid">
          <div v-for="share in collectedShares" :key="share.id" class="share-card" @click="goToShareDetail(share.id)">
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
      
      <!-- 观看历史内容 -->
      <div v-else-if="currentNav === 'history'">
        <div v-if="historyShares.length === 0" class="empty-works">
          <i class="el-icon-time"></i>
          <p>暂无观看历史</p>
        </div>
        
        <div v-else class="shares-grid">
          <div v-for="share in historyShares" :key="share.id" class="share-card" @click="goToShareDetail(share.id)">
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

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑资料" width="500px" :before-close="handleCloseEditDialog">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="editForm.bio" type="textarea" :rows="3" placeholder="请输入个性签名" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div class="avatar-container">
            <!-- 当前头像显示 -->
            <div class="current-avatar">
              <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
              <i v-else class="el-icon-user avatar-placeholder"></i>
            </div>
            <!-- 更换头像按钮 -->
            <el-upload class="avatar-uploader" :http-request="handleCustomAvatarUpload" :show-file-list="false" :before-upload="beforeAvatarUpload" style="display: inline-block;">
              <el-button type="primary" plain size="small" style="margin-top: 12px;">更换头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import request from '@/api/request'
import { fetchUserShares, getUserLikedShares, getUserCollectedShares, getFollowings, getFollowers, getFollowingCount, getFollowerCount } from '@/api'

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)

    const defaultAvatar = '/default-avatar.png'
    const editDialogVisible = ref(false)
    const securityDialogVisible = ref(false)
    const privacyDialogVisible = ref(false)
    const aboutDialogVisible = ref(false)

    // 导航状态
    const currentNav = ref('works') // works, likes, collections, history
    
    // 分享列表数据
    const shares = ref([])
    const likedShares = ref([])
    const collectedShares = ref([])
    const followings = ref([])
    const followers = ref([])
    
    // 统计数据
    const followingCount = ref(0)
    const followerCount = ref(0)
    const totalLikes = ref(0)

    const editForm = reactive({
      nickname: '',
      bio: '',
      avatar: ''
    })
    
    // 切换导航
    const switchNav = async (navType) => {
      currentNav.value = navType
      // 根据导航类型加载不同数据
      if (navType === 'likes') {
        await loadLikedShares()
      } else if (navType === 'collections') {
        await loadCollectedShares()
      } else if (navType === 'followings') {
        await loadFollowings()
      } else if (navType === 'followers') {
        await loadFollowers()
      }
    }

    // 方法
    const editAvatar = () => {
      ElMessage.info('点击了编辑头像')
    }

    const showEditDialog = () => {
      Object.assign(editForm, userInfo.value)
      editDialogVisible.value = true
    }

    const showSecurityDialog = () => {
      ElMessage.info('安全设置功能开发中')
    }

    const showPrivacyDialog = () => {
      ElMessage.info('隐私设置功能开发中')
    }

    const showAboutDialog = () => {
      ElMessage.info('关于我们功能开发中')
    }

    const handleCloseEditDialog = (done) => {
      ElMessageBox.confirm('确定要放弃修改吗？')
        .then(() => done())
        .catch(() => {})
    }

    const handleCustomAvatarUpload = (options) => {
      const { file, onSuccess, onError } = options
      const formData = new FormData()
      formData.append('file', file)

      request.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        console.log('头像上传响应:', response)
        if (response.code === 200 && response.data) {
          editForm.avatar = response.data.avatar
          userStore.updateUserInfo({ avatar: response.data.avatar })
          ElMessage.success('头像上传成功')
          onSuccess(response)
        } else {
          ElMessage.error(response.message || '头像上传失败')
          onError(response)
        }
      }).catch(error => {
        console.error('头像上传失败:', error)
        console.error('错误响应:', error.response)
        ElMessage.error('头像上传失败，请重试')
        onError(error)
      })
    }

    const handleAvatarSuccess = (response, file) => {
      // 这个函数现在可能不会被调用，因为我们使用了自定义上传
      console.log('头像上传成功:', response)
    }

    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        ElMessage.error('头像图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('头像图片大小不能超过 2MB!')
        return false
      }
      return true
    }

    const saveProfile = async () => {
      try {
        // 调用 API 保存资料
        userStore.updateUserInfo(editForm)
        editDialogVisible.value = false
        ElMessage.success('资料更新成功')
      } catch (error) {
        ElMessage.error('资料更新失败')
      }
    }

    const goToMyFavorites = () => {
      router.push('/favorites')
    }

    const goToMyShares = () => {
      router.push('/shares')
    }

    const goToHistory = () => {
      router.push('/history')
    }

    const goToShareDetail = (id) => {
      router.push(`/share/${id}`)
    }

    // 加载用户分享
    const loadShares = async () => {
      try {
        // 调用真实API获取用户分享
        const userShares = await fetchUserShares()
        
        // 转换数据格式以适配前端
        shares.value = userShares.map(share => ({
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
    
    // 加载用户点赞的分享
    const loadLikedShares = async () => {
      try {
        const likedSharesData = await getUserLikedShares()
        
        likedShares.value = likedSharesData.map(share => ({
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
        console.error('加载点赞分享失败:', error)
        ElMessage.error('加载点赞分享失败')
      }
    }
    
    // 加载用户收藏的分享
    const loadCollectedShares = async () => {
      try {
        const collectedSharesData = await getUserCollectedShares()
        
        collectedShares.value = collectedSharesData.map(share => ({
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
        console.error('加载收藏分享失败:', error)
        ElMessage.error('加载收藏分享失败')
      }
    }
    
    // 加载关注列表
    const loadFollowings = async () => {
      try {
        const followingsData = await getFollowings()
        followings.value = followingsData
      } catch (error) {
        console.error('加载关注列表失败:', error)
        ElMessage.error('加载关注列表失败')
      }
    }
    
    // 加载粉丝列表
    const loadFollowers = async () => {
      try {
        const followersData = await getFollowers()
        followers.value = followersData
      } catch (error) {
        console.error('加载粉丝列表失败:', error)
        ElMessage.error('加载粉丝列表失败')
      }
    }
    
    // 跳转到用户主页
    const goToUserProfile = (userId) => {
      router.push(`/user/${userId}`)
    }
    
    // 加载统计数据
    const loadStats = async () => {
      try {
        // 获取关注数
        const followingCountData = await getFollowingCount(userInfo.value.id)
        followingCount.value = followingCountData
        
        // 获取粉丝数
        const followerCountData = await getFollowerCount(userInfo.value.id)
        followerCount.value = followerCountData
        
        // 计算总获赞数（从分享列表中统计）
        if (shares.value.length > 0) {
          totalLikes.value = shares.value.reduce((sum, share) => sum + (share.likes || 0), 0)
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
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
      await loadShares()
      await loadStats()
      try {
        // 调用 API 获取用户信息
        // const response = await getUserInfo()
        // Object.assign(userInfo, response.data)
      } catch (error) {
        ElMessage.error('获取用户信息失败')
      }
    })

    return {
      userInfo,
      defaultAvatar,
      editDialogVisible,
      securityDialogVisible,
      privacyDialogVisible,
      aboutDialogVisible,
      editForm,
      editAvatar,
      showEditDialog,
      showSecurityDialog,
      showPrivacyDialog,
      showAboutDialog,
      handleCloseEditDialog,
      handleAvatarSuccess,
      handleCustomAvatarUpload,
      beforeAvatarUpload,
      saveProfile,
      goToMyFavorites,
      goToMyShares,
      goToHistory,
      goToShareDetail,
      currentNav,
      switchNav,
      shares,
      likedShares,
      collectedShares,
      followings,
      followers,
      followingCount,
      followerCount,
      totalLikes,
      formatTime,
      goToUserProfile
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
  cursor: pointer;
  position: relative;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--text-primary);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* 用户基本信息 */
.user-details {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

/* 关注、粉丝、获赞统计 */
.stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 个性签名 */
.bio {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 中间导航栏 */
.profile-nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  height: 100%;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  padding: 0 16px;
}

.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--text-primary);
  border-bottom: 2px solid var(--accent-color);
  font-weight: 600;
}

.nav-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.nav-item.active .nav-count {
  color: var(--text-primary);
}

/* 作品列表容器 */
.works-container {
  padding: 16px;
  background-color: var(--bg-primary);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 空作品状态 */
.empty-works {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--text-secondary);
}

.empty-works i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-works p {
  font-size: 14px;
}

/* 分享列表网格布局 */
.shares-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* 分享卡片样式 */
.share-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* 分享封面样式 */
.share-cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.share-card:hover .cover-image {
  transform: scale(1.05);
}

/* 封面悬浮层 */
.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
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
  font-size: 32px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.share-card:hover .cover-overlay i {
  opacity: 1;
}

/* 互动数据悬浮层 */
.interaction-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 16px;
  color: white;
  font-size: 12px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* 分享内容样式 */
.share-content {
  padding: 16px;
}

.music-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.music-artist {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.content-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 标签样式 */
.share-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.content-tag {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  border: none;
  font-size: 11px;
  padding: 2px 8px;
}

/* 发布时间样式 */
.share-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 编辑资料对话框样式 */
:deep(.el-dialog) {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-dialog__title) {
  color: var(--text-primary);
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(255, 0, 80, 0.2);
}

/* 头像上传组件样式 */
:deep(.el-upload) {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
}

:deep(.el-upload:hover) {
  border-color: var(--accent-color);
}

.avatar-container {
  margin-bottom: 16px;
}

.current-avatar {
  margin-bottom: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 40px;
  background-color: var(--bg-secondary);
  border-radius: 50%;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 16px;
  }
  
  .user-info-section {
    gap: 16px;
  }
  
  .user-avatar {
    width: 64px;
    height: 64px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .stats {
    gap: 16px;
  }
  
  .stat-number {
    font-size: 14px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .shares-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>