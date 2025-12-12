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

      <!-- 分享音乐 -->
      <el-card class="music-card">
        <div class="music-info">
          <div class="music-cover">
            <img :src="shareDetail.music.cover" alt="音乐封面">
          </div>
          <div class="music-details">
            <h4>{{ shareDetail.music.title }}</h4>
            <p class="artist">{{ shareDetail.music.artist }}</p>
            <p class="album">{{ shareDetail.music.album }}</p>
          </div>
          <el-button type="primary" class="play-button">
            <el-icon><VideoPlay /></el-icon>
            播放
          </el-button>
        </div>
      </el-card>

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
import { VideoPlay, Star, Collection, Share } from '@element-plus/icons-vue'

const route = useRoute()
const shareId = ref(route.params.id)

// 模拟分享详情数据
const shareDetail = ref({
  id: '1',
  userName: '音乐达人',
  userAvatar: '/src/assets/default-avatar.png',
  shareTime: '2小时前',
  content: '这首歌真的太好听了，分享给大家！每次听到这首歌都会想起美好的回忆，希望你们也能喜欢。',
  liked: false,
  likedCount: 42,
  collected: false,
  collectedCount: 18,
  sharedCount: 12,
  music: {
    id: '1001',
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    cover: '/src/assets/default-music-cover.png',
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

// 页面加载时获取分享详情
onMounted(() => {
  // 这里可以添加获取真实数据的逻辑
  console.log('获取分享详情，ID:', shareId.value)
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