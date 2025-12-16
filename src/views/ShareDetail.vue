<template>
  <div class="share-detail-container">
    <div class="share-content">
      <!-- 分享人信息 -->
      <div class="sharer-info">
        <el-avatar :size="48" :src="shareDetail.userAvatar"></el-avatar>
        <div class="sharer-details">
          <h3>{{ shareDetail.userName }}</h3>
          <p class="share-time">{{ shareDetail.shareTime }}</p>
        </div>
      </div>

      <!-- 分享内容 -->
      <div class="share-text">
        <p>{{ shareDetail.content }}</p>
      </div>

      <!-- 分享音乐播放器 -->
      <Player :music-info="shareDetail.music" :autoplay="false" />

      <!-- 互动按钮 -->
      <div class="interaction-buttons">
        <el-button 
          :type="shareDetail.liked ? 'primary' : 'default'" 
          class="interaction-button" 
          @click="toggleLike"
        >
          <el-icon><Star /></el-icon>
          {{ shareDetail.liked ? '已喜欢' : '喜欢' }} ({{ shareDetail.likedCount }})
        </el-button>
        <el-button 
          :type="shareDetail.collected ? 'primary' : 'default'" 
          class="interaction-button" 
          @click="toggleCollect"
        >
          <el-icon><Collection /></el-icon>
          {{ shareDetail.collected ? '已收藏' : '收藏' }} ({{ shareDetail.collectedCount }})
        </el-button>
        <el-button 
          type="default" 
          class="interaction-button" 
          @click="handleShare"
        >
          <el-icon><Share /></el-icon>
          转发 ({{ shareDetail.sharedCount }})
        </el-button>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comment-section">
      <div class="comment-header">
        <h3>评论 ({{ comments.length }})</h3>
      </div>

      <!-- 评论输入框 -->
      <div class="comment-input">
        <el-input
          v-model="newComment"
          placeholder="写下你的评论..."
          type="textarea"
          :rows="3"
        ></el-input>
        <el-button type="primary" class="submit-comment" @click="submitComment">
          发表评论
        </el-button>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <el-avatar :size="32" :src="comment.userAvatar"></el-avatar>
          <div class="comment-content">
            <div class="comment-user-info">
              <span class="comment-user-name">{{ comment.userName }}</span>
              <span class="comment-time">{{ comment.commentTime }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Star, Collection, Share } from '@element-plus/icons-vue'
import { fetchShareDetail } from '../api/index'
import { getMusicDetail, getMusicUrl } from '../api/netease'
import Player from '../components/Player.vue'

const route = useRoute()
const shareId = ref(route.params.id)

// 分享详情数据
const shareDetail = ref({
  id: '',
  userName: '',
  userAvatar: 'https://via.placeholder.com/32x32/cccccc/ffffff?text=用户',
  shareTime: '',
  content: '',
  liked: false,
  likedCount: 0,
  collected: false,
  collectedCount: 0,
  sharedCount: 0,
  music: {
    id: '',
    title: '',
    artist: '',
    album: '',
    cover: 'https://via.placeholder.com/120x120/666666/ffffff?text=音乐封面',
    url: '#'
  }
})

// 喜欢功能
const toggleLike = () => {
  shareDetail.value.liked = !shareDetail.value.liked
  if (shareDetail.value.liked) {
    shareDetail.value.likedCount++
  } else {
    shareDetail.value.likedCount--
  }
}

// 收藏功能
const toggleCollect = () => {
  shareDetail.value.collected = !shareDetail.value.collected
  if (shareDetail.value.collected) {
    shareDetail.value.collectedCount++
  } else {
    shareDetail.value.collectedCount--
  }
}

// 转发功能
const handleShare = () => {
  // 这里可以添加转发逻辑
  alert('转发功能开发中...')
}

// 模拟评论数据
const comments = ref([
  {
    id: '1',
    userName: '音乐爱好者',
    userAvatar: '/src/assets/default-avatar.png',
    commentTime: '1小时前',
    content: '确实很好听，我也很喜欢这首歌！'
  },
  {
    id: '2',
    userName: '周杰伦粉丝',
    userAvatar: '/src/assets/default-avatar.png',
    commentTime: '30分钟前',
    content: '周杰伦的经典之作，百听不厌！'
  },
  {
    id: '3',
    userName: '新用户',
    userAvatar: '/src/assets/default-avatar.png',
    commentTime: '10分钟前',
    content: '第一次听，确实不错！'
  }
])

// 新评论
const newComment = ref('')

// 提交评论
const submitComment = () => {
  if (newComment.value.trim()) {
    const newCommentItem = {
      id: Date.now().toString(),
      userName: '当前用户',
      userAvatar: '/src/assets/default-avatar.png',
      commentTime: '刚刚',
      content: newComment.value.trim()
    }
    comments.value.unshift(newCommentItem)
    newComment.value = ''
  }
}

// 获取分享详情
const getShareDetail = async () => {
  try {
    console.log('===== 开始执行getShareDetail方法 =====')
    console.log('当前shareId:', shareId.value)
    
    if (shareId.value) {
      const shareData = await fetchShareDetail(shareId.value)
      console.log('获取到的分享数据:', shareData)
      
      // 检查API响应结构
      const shareDataResponse = shareData.data || shareData
      console.log('处理后的分享数据:', shareDataResponse)
      
      // 获取音乐详情
      let musicCover = 'https://via.placeholder.com/120x120/666666/ffffff?text=音乐封面'
      let musicAlbum = ''
      let musicUrl = '#'
      
      if (shareDataResponse.musicId) {
        console.log('开始获取音乐详情，musicId:', shareDataResponse.musicId)
        
        try {
          // 获取音乐详情和封面
          const musicDetail = await getMusicDetail(shareDataResponse.musicId)
          console.log('获取到的音乐详情:', musicDetail)
          
          if (musicDetail) {
            musicCover = musicDetail.pic || musicCover
            musicAlbum = musicDetail.album || ''
          }
          
          // 获取音乐播放URL
          console.log('尝试获取音乐播放URL, musicId:', shareDataResponse.musicId)
          const musicUrlData = await getMusicUrl(shareDataResponse.musicId)
          console.log('getMusicUrl返回数据:', musicUrlData)
          
          if (musicUrlData && musicUrlData.url) {
            musicUrl = musicUrlData.url
            console.log('成功获取到播放URL:', musicUrl)
          } else {
            console.warn('未获取到有效的播放URL，使用fallback')
            musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          }
        } catch (error) {
          console.error('获取音乐信息失败:', error)
          // 失败时使用fallback
          musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }
      }
      
      // 格式化分享时间
      const shareTime = new Date(shareDataResponse.createdAt)
      const now = new Date()
      const diffMs = now - shareTime
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      let formattedTime = ''
      if (diffDays > 0) {
        formattedTime = `${diffDays}天前`
      } else if (diffHours > 0) {
        formattedTime = `${diffHours}小时前`
      } else if (diffMins > 0) {
        formattedTime = `${diffMins}分钟前`
      } else {
        formattedTime = '刚刚'
      }
      
      // 更新分享详情数据
      console.log('准备更新shareDetail数据，音乐URL:', musicUrl)
      
      shareDetail.value = {
        id: shareDataResponse.id,
        userName: shareDataResponse.user?.nickname || '未知用户',
        userAvatar: shareDataResponse.user?.avatar || 'https://via.placeholder.com/32x32/cccccc/ffffff?text=用户',
        shareTime: formattedTime,
        content: shareDataResponse.content,
        liked: false, // 默认未喜欢
        likedCount: shareDataResponse.likedCount || 0,
        collected: false, // 默认未收藏
        collectedCount: shareDataResponse.collectedCount || 0,
        sharedCount: shareDataResponse.sharedCount || 0,
        music: {
          id: shareDataResponse.musicId,
          title: shareDataResponse.musicTitle,
          artist: shareDataResponse.musicArtist,
          album: musicAlbum,
          cover: musicCover,
          url: musicUrl  // 使用获取到的真实URL
        }
      }
      
      console.log('shareDetail数据更新完成:', shareDetail.value)
      console.log('更新后的音乐URL:', shareDetail.value.music.url)
    }
  } catch (error) {
    console.error('===== 获取分享详情失败 =====')
    console.error('错误对象:', error)
    console.error('错误信息:', error.message)
    console.error('错误堆栈:', error.stack)
  }
}

// 页面加载时获取分享详情
onMounted(() => {
  getShareDetail()
})
</script>

<style scoped>
.share-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.share-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.sharer-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sharer-details {
  margin-left: 16px;
}

.sharer-details h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.share-time {
  margin: 4px 0 0;
  color: #909399;
  font-size: 14px;
}

.share-text {
  margin-bottom: 20px;
}

.share-text p {
  font-size: 16px;
  line-height: 1.6;
  color: #303133;
}

.music-card {
  margin-bottom: 0;
}

.music-info {
  display: flex;
  align-items: center;
}

.music-cover {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 8px;
}

.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-details {
  flex: 1;
  margin-left: 20px;
}

.music-details h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.music-details .artist,
.music-details .album {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.play-button {
  margin-left: auto;
}

.interaction-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.interaction-button {
  min-width: 120px;
}

.comment-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.comment-header {
  margin-bottom: 20px;
}

.comment-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.comment-input {
  margin-bottom: 24px;
}

.submit-comment {
  margin-top: 12px;
  float: right;
}

.comment-list {
  margin-top: 32px;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
}

.comment-content {
  margin-left: 12px;
  flex: 1;
}

.comment-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user-name {
  font-weight: 600;
  margin-right: 12px;
  color: #303133;
}

.comment-time {
  color: #909399;
  font-size: 12px;
}

.comment-text {
  margin: 0;
  color: #303133;
  line-height: 1.6;
}
</style>