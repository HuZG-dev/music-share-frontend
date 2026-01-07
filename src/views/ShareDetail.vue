<template>
  <div class="share-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button-wrapper">
      <el-button @click="goBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>
    
    <div class="share-content">
      <!-- 分享人信息 -->
      <div class="sharer-info">
        <el-avatar :size="48" :src="shareDetail.userAvatar"></el-avatar>
        <div class="sharer-details">
          <h3>{{ shareDetail.userName }}</h3>
          <p class="share-time">{{ shareDetail.shareTime }}</p>
        </div>
        <div class="sharer-actions">
          <el-button size="default" @click="goToUserProfile">主页</el-button>
          <el-button size="default" type="primary" @click="handleFollow">
            {{ isFollowing ? '已关注' : '关注' }}
          </el-button>
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
import { useRoute, useRouter } from 'vue-router'
import { Star, Collection, Share, ArrowLeft } from '@element-plus/icons-vue'
import { fetchShareDetail, getComments, createComment, deleteComment, likeShare, unlikeShare, checkLikeStatus, collectShare, uncollectShare, checkCollectionStatus, followUser, unfollowUser, checkFollowStatus } from '../api/index'
import { getMusicDetail, getMusicUrl } from '../api/netease'
import Player from '../components/Player.vue'

const route = useRoute()
const router = useRouter()
const shareId = ref(route.params.id)
const isFollowing = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 评论列表数据
const comments = ref([])
const loadingComments = ref(false)

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
const toggleLike = async () => {
  try {
    if (shareDetail.value.liked) {
      // 取消点赞
      await unlikeShare(shareId.value)
      shareDetail.value.liked = false
      shareDetail.value.likedCount--
    } else {
      // 点赞
      await likeShare(shareId.value)
      shareDetail.value.liked = true
      shareDetail.value.likedCount++
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    alert('操作失败，请重试')
  }
}

// 收藏功能
const toggleCollect = async () => {
  try {
    if (shareDetail.value.collected) {
      await uncollectShare(shareId.value)
      shareDetail.value.collected = false
      shareDetail.value.collectedCount--
    } else {
      await collectShare(shareId.value)
      shareDetail.value.collected = true
      shareDetail.value.collectedCount++
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    alert('操作失败，请重试')
  }
}

// 转发功能
const handleShare = () => {
  // 这里可以添加转发逻辑
  alert('转发功能开发中...')
}

// 跳转到用户主页
const goToUserProfile = () => {
  if (shareDetail.value.userId) {
    router.push(`/user/${shareDetail.value.userId}`)
  }
}

// 关注/取消关注
const handleFollow = async () => {
  try {
    if (isFollowing.value) {
      const res = await unfollowUser(shareDetail.value.userId)
      if (res.code === 200) {
        isFollowing.value = false
        alert('已取消关注')
      } else {
        alert(res.message || '取消关注失败')
      }
    } else {
      const res = await followUser(shareDetail.value.userId)
      if (res.code === 200) {
        isFollowing.value = true
        alert('关注成功')
      } else {
        alert(res.message || '关注失败')
      }
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    alert('操作失败，请重试')
  }
}

// 检查关注状态
const checkFollow = async () => {
  if (shareDetail.value.userId) {
    try {
      const status = await checkFollowStatus(shareDetail.value.userId)
      isFollowing.value = status === true
    } catch (error) {
      console.error('检查关注状态失败:', error)
      isFollowing.value = false
    }
  }
}

// 新评论
const newComment = ref('')

// 获取评论列表
const loadComments = async () => {
  if (!shareId.value) {
    console.log('获取评论失败: shareId为空')
    return
  }
  
  loadingComments.value = true
  try {
    console.log('开始获取评论, shareId:', shareId.value)
    const result = await getComments(shareId.value)
    console.log('获取到的评论数据:', result)
    
    if (!result || !Array.isArray(result)) {
      console.error('评论数据格式错误:', result)
      comments.value = []
      return
    }
    
    comments.value = result.map(comment => ({
      id: comment.id,
      userName: comment.user.nickname,
      userAvatar: comment.user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23cccccc' width='32' height='32'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='white'%3E用户%3C/text%3E%3C/svg%3E",
      commentTime: formatCommentTime(comment.createdAt),
      content: comment.content,
      userId: comment.user.id,
      parent: comment.parent
    }))
    console.log('转换后的评论数据:', comments.value)
  } catch (error) {
    console.error('获取评论失败:', error)
    if (error.response) {
      console.error('错误响应:', error.response.status, error.response.data)
    }
    comments.value = []
  } finally {
    loadingComments.value = false
  }
}

// 格式化评论时间
const formatCommentTime = (dateTime) => {
  const now = new Date()
  const commentDate = new Date(dateTime)
  const diffMs = now - commentDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}天前`
  if (diffHours > 0) return `${diffHours}小时前`
  if (diffMins > 0) return `${diffMins}分钟前`
  return '刚刚'
}

// 提交评论
const submitComment = async () => {
  alert('函数被调用了')
  console.log('===== submitComment 开始 =====', new Date())
  
  if (!newComment.value.trim()) {
    console.log('评论内容为空')
    alert('请输入评论内容')
    return
  }
  
  console.log('开始提交评论, shareId:', shareId.value, '内容:', newComment.value)
  
  try {
    const result = await createComment(shareId.value, newComment.value.trim())
    console.log('评论提交成功:', result)
    newComment.value = ''
    // 重新加载评论列表
    await loadComments()
  } catch (error) {
    console.error('发表评论失败:', error)
    if (error.response) {
      console.error('错误响应:', error.response.status, error.response.data)
      alert(`发表评论失败: ${error.response.data.message || error.response.statusText}`)
    } else {
      alert('发表评论失败，请重试')
    }
  }
}

// 删除评论
const handleDeleteComment = async (commentId) => {
  if (!confirm('确定要删除这条评论吗？')) return
  
  try {
    await deleteComment(commentId)
    await loadComments()
  } catch (error) {
    console.error('删除评论失败:', error)
    alert('删除失败，请重试')
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
      let musicDuration = 0
      
      if (shareDataResponse.musicId) {
        console.log('开始获取音乐详情，musicId:', shareDataResponse.musicId)
        
        try {
          // 获取音乐详情和封面
          const musicDetail = await getMusicDetail(shareDataResponse.musicId)
          console.log('获取到的音乐详情:', musicDetail)
          
          if (musicDetail) {
            musicCover = musicDetail.pic || musicCover
            musicAlbum = musicDetail.album || ''
            // duration是毫秒，转为秒
            musicDuration = musicDetail.duration ? Math.floor(musicDetail.duration / 1000) : 0
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
      
      // 检查点赞状态
      let isLiked = false
      try {
        isLiked = await checkLikeStatus(shareId.value)
        console.log('点赞状态:', isLiked)
      } catch (error) {
        console.error('检查点赞状态失败:', error)
      }
      
      // 检查收藏状态
      let isCollected = false
      try {
        isCollected = await checkCollectionStatus(shareId.value)
        console.log('收藏状态:', isCollected)
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
      
      shareDetail.value = {
        id: shareDataResponse.id,
        userId: shareDataResponse.user?.id,
        userName: shareDataResponse.user?.nickname || '未知用户',
        userAvatar: shareDataResponse.user?.avatar || 'https://via.placeholder.com/32x32/cccccc/ffffff?text=用户',
        shareTime: formattedTime,
        content: shareDataResponse.content,
        liked: isLiked,
        likedCount: shareDataResponse.likedCount || 0,
        collected: isCollected, // 使用真实收藏状态
        collectedCount: shareDataResponse.collectedCount || 0,
        sharedCount: shareDataResponse.sharedCount || 0,
        music: {
          id: shareDataResponse.musicId,
          title: shareDataResponse.musicTitle,
          artist: shareDataResponse.musicArtist,
          album: musicAlbum,
          cover: musicCover,
          url: musicUrl,
          duration: musicDuration
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

// 页面加载时获取分享详情和评论
onMounted(async () => {
  console.log('ShareDetail页面已加载, shareId:', shareId.value)
  await getShareDetail()
  await loadComments()
  await checkFollow()
  console.log('ShareDetail页面初始化完成')
})
</script>

<style scoped>
.share-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 返回按钮样式 */
.back-button-wrapper {
  margin-bottom: 16px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-button .el-icon {
  font-size: 16px;
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
  flex: 1;
}

.sharer-details h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sharer-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
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