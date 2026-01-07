<template>
  <div class="share-create-page">
    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 左侧：分享编辑 -->
        <div class="edit-section">
          <el-card class="edit-card">
            <!-- 音乐选择 -->
            <div class="music-selector">
              <div class="section-title">选择音乐</div>
              
              <!-- 搜索框 -->
              <div class="search-box">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索歌曲、歌手或专辑..."
                  clearable
                  @input="handleSearchInput"
                  @clear="clearSearchResults"
                  @keyup.enter="handleSearch"
                >
                  <template #append>
                    <el-button :icon="Search" @click="handleSearch" />
                  </template>
                </el-input>
              </div>

              <!-- 搜索结果显示 -->
              <div v-if="searchResults.length > 0" class="search-results">
                <div class="results-header">
                  <span>搜索结果</span>
                  <span class="results-count">找到 {{ searchResults.length }} 首歌曲</span>
                </div>
                <div class="music-list">
                  <div
                    v-for="music in searchResults"
                    :key="music.id"
                    class="music-item"
                    :class="{ selected: selectedMusic?.id === music.id }"
                    @click="selectMusic(music)"
                  >
                    <div class="music-cover">
                      <img :src="music.cover" :alt="music.title" />
                      <div class="cover-overlay">
                        <el-button 
                          type="text" 
                          size="small" 
                          @click.stop="handlePlayClick(music, $event)"
                          :disabled="isLoadingMusic"
                        >
                          <el-icon><VideoPlay /></el-icon>
                        </el-button>
                      </div>
                    </div>
                    <div class="music-info">
                      <h4 class="music-title">{{ music.title }}</h4>
                      <p class="music-artist">{{ music.artist }}</p>
                      <p class="music-album">{{ music.album }}</p>
                    </div>
                    <div class="music-duration">{{ formatDuration(music.duration) }}</div>
                  </div>
                </div>
                
                <!-- 播放器组件 -->
                <div class="music-player">
                  <Player 
                    :music-info="currentPlayingMusic || {
                      title: '请选择一首音乐',
                      artist: '',
                      cover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
                      url: ''
                    }"
                    :autoplay="true"
                  />
                </div>
              </div>

              <!-- 已选音乐展示 -->
              <div v-if="selectedMusic" class="selected-music">
                <div class="section-title">已选音乐</div>
                <div class="selected-music-card">
                  <div class="music-cover">
                    <img :src="selectedMusic.cover" :alt="selectedMusic.title" />
                  </div>
                  <div class="music-details">
                    <h4 class="music-title">{{ selectedMusic.title }}</h4>
                    <p class="music-artist">{{ selectedMusic.artist }}</p>
                    <p class="music-album">{{ selectedMusic.album }}</p>
                  </div>
                  <el-button type="danger" text @click="clearSelection">取消选择</el-button>
                </div>
              </div>
            </div>

            <!-- 分享内容编辑 -->
            <div class="content-editor">
              <div class="section-title">分享内容</div>
              <el-input
                v-model="shareContent"
                type="textarea"
                :rows="5"
                placeholder="分享你对这首歌的感受、故事或推荐理由..."
                maxlength="500"
                show-word-limit
                resize="none"
              />
            </div>

            <!-- 分类选择 -->
            <div class="category-selector">
              <div class="section-title">
                分类设置
                <span class="sub-title">（必选）</span>
              </div>
              <div class="category-container">
                <el-select
                  v-model="selectedCategory"
                  placeholder="请选择音乐分类"
                  class="category-select"
                >
                  <el-option
                    v-for="category in musicCategories"
                    :key="category"
                    :label="category"
                    :value="category"
                  />
                </el-select>
              </div>
            </div>

            <!-- 隐私设置 -->
            <div class="privacy-settings">
              <div class="section-title">隐私设置</div>
              <el-radio-group v-model="privacy">
                <el-radio label="public">
                  <div class="privacy-option">
                    <el-icon><View /></el-icon>
                    <span>公开</span>
                    <div class="privacy-desc">所有用户可见</div>
                  </div>
                </el-radio>
                <el-radio label="friends">
                  <div class="privacy-option">
                    <el-icon><User /></el-icon>
                    <span>仅好友可见</span>
                    <div class="privacy-desc">只有你的好友可以看到</div>
                  </div>
                </el-radio>
                <el-radio label="private">
                  <div class="privacy-option">
                    <el-icon><Lock /></el-icon>
                    <span>私密</span>
                    <div class="privacy-desc">仅自己可见</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>

            <!-- 发布按钮 -->
            <div class="action-buttons">
              <el-button @click="handleCancel">取消</el-button>
              <el-button
                type="primary"
                :loading="publishing"
                :disabled="!canPublish"
                @click="handlePublish"
              >
                {{ publishing ? '发布中...' : '发布分享' }}
              </el-button>
            </div>
          </el-card>
        </div>

        <!-- 右侧：发布指引 -->
        <div class="guide-section">
          <el-card class="guide-card">
            <template #header>
              <div class="guide-header">
                <el-icon><InfoFilled /></el-icon>
                <span>发布指引</span>
              </div>
            </template>
            
            <div class="guide-content">
              <div class="guide-item">
                <div class="guide-icon">🎵</div>
                <div class="guide-text">
                  <strong>选择音乐</strong>
                  <p>搜索并选择你想要分享的音乐</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">💬</div>
                <div class="guide-text">
                  <strong>分享感受</strong>
                  <p>写下你对这首歌的感受或故事</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">🏷️</div>
                <div class="guide-text">
                  <strong>分类设置</strong>
                  <p>选择合适的分类让更多人发现你的分享</p>
                </div>
              </div>
              
              <div class="guide-item">
                <div class="guide-icon">🔒</div>
                <div class="guide-text">
                  <strong>设置隐私</strong>
                  <p>选择谁可以看到你的分享</p>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 最近分享 -->
          <el-card class="recent-shares-card">
            <template #header>
              <div class="recent-header">
                <el-icon><Clock /></el-icon>
                <span>最近分享</span>
              </div>
            </template>
            
            <div class="recent-shares">
              <div v-for="share in recentShares" :key="share.id" class="recent-share">
                <div class="recent-music">
                  <img :src="share.musicCover" :alt="share.musicTitle" />
                  <div class="recent-info">
                    <div class="recent-title">{{ share.musicTitle }}</div>
                    <div class="recent-artist">{{ share.musicArtist }}</div>
                  </div>
                </div>
                <div class="recent-time">{{ share.time }}</div>
              </div>
              
              <div v-if="recentShares.length === 0" class="no-recent">
                暂无分享记录
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  VideoPlay,
  View,
  User,
  Lock,
  InfoFilled,
  Clock
} from '@element-plus/icons-vue'
// 导入网易云音乐搜索API
import { searchMusic, getMusicUrl } from '../api/netease.js'
// 导入播放器组件
import Player from '../components/Player.vue'
// 导入创建分享API
import { createShare, fetchUserShares } from '../api/index.js'

const router = useRouter()

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref([])
const selectedMusic = ref(null)

// 播放相关
const currentPlayingMusic = ref(null)
const isLoadingMusic = ref(false)

// 分享内容
const shareContent = ref('')
const selectedCategory = ref('')
const privacy = ref('public')
const publishing = ref(false)

// 音乐分类
const musicCategories = ref([
  '流行', '民谣', 'R&B', '说唱', '摇滚', '轻音'
])

// 最近分享
const recentShares = ref([])

// 计算属性：是否可以发布
const canPublish = computed(() => {
  return selectedMusic.value && shareContent.value.trim().length > 0 && selectedCategory.value
})

// 方法
const handleSearchInput = (value) => {
  // 添加防抖搜索
  if (value && value.trim().length > 0) {
    // 可以考虑添加防抖功能
    // setTimeout(() => {
    //   handleSearch();
    // }, 500);
  } else {
    clearSearchResults();
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    // 调用网易云音乐搜索API
    const results = await searchMusic(searchKeyword.value.trim())
    // 转换API返回的数据格式以匹配页面需求
    searchResults.value = results.map(music => ({
      id: music.id,
      title: music.name,
      artist: music.artist,
      album: typeof music.album === 'object' ? music.album.name : music.album,
      cover: music.pic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
      duration: music.duration || 0,
      source: 'netease'
    }))
    // 清空当前播放，避免自动播放
    currentPlayingMusic.value = null
  } catch (error) {
    console.error('搜索音乐失败:', error)
    ElMessage.error('搜索失败，请重试')
  }
}

const clearSearchResults = () => {
  searchResults.value = []
}

// 播放音乐
const playMusic = async (music) => {
  if (!music) return
  
  try {
    console.log('开始播放音乐:', music.title, '-', music.artist, 'ID:', music.id)
    isLoadingMusic.value = true
    // 获取音乐播放URL
    const musicWithUrl = await getMusicUrl(music.id)
    
    console.log('获取到音乐URL数据:', JSON.stringify(musicWithUrl, null, 2))
    
    // 不使用测试URL，如果获取失败就不播放
    if (!musicWithUrl.url) {
      ElMessage.error('无法获取音乐播放URL')
      return
    }
    
    const finalUrl = musicWithUrl.url
    console.log('最终使用的音乐URL:', finalUrl)
    
    // 更新当前播放歌曲信息，合并搜索结果和播放URL
    currentPlayingMusic.value = {
      id: music.id,
      title: music.title,
      artist: music.artist,
      album: music.album,
      cover: music.cover,
      url: finalUrl
    }
    
    console.log('当前播放歌曲:', JSON.stringify(currentPlayingMusic.value, null, 2))
    console.log('传递给Player组件的URL:', currentPlayingMusic.value.url)
  } catch (error) {
    console.error('播放音乐失败:', error)
    ElMessage.error('播放失败，请重试')
  } finally {
    isLoadingMusic.value = false
  }
}

const selectMusic = (music) => {
  selectedMusic.value = music
  // 点击选择时播放音乐
  playMusic(music)
}

const clearSelection = () => {
  selectedMusic.value = null
}

// 点击播放按钮时才播放音乐
const handlePlayClick = (music, event) => {
  event.stopPropagation()
  playMusic(music)
}



const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handlePublish = async () => {
  if (!canPublish.value) return

  publishing.value = true

  try {
    console.log('selectedMusic.value.duration:', selectedMusic.value.duration)
    // 构建分享数据
    const shareData = {
      musicId: selectedMusic.value.id,
      musicTitle: selectedMusic.value.title,
      musicArtist: selectedMusic.value.artist,
      musicAlbum: selectedMusic.value.album,
      musicCover: selectedMusic.value.cover,
      musicDuration: selectedMusic.value.duration || 0, // 添加时长字段
      content: shareContent.value.trim(),
      musicCategory: selectedCategory.value,
      privacy: privacy.value
    }
    
    console.log('发布分享数据:', shareData)
    console.log('musicDuration值:', shareData.musicDuration)
    
    // 调用创建分享API
    await createShare(shareData)
    
    ElMessage.success('分享发布成功！')
    router.push('/')
  } catch (error) {
    console.error('发布失败:', error)
    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', error.response.data)
      console.error('响应头:', error.response.headers)
    } else if (error.request) {
      console.error('请求已发送但未收到响应:', error.request)
    } else {
      console.error('请求设置错误:', error.message)
    }
    ElMessage.error('发布失败，请重试')
  } finally {
    publishing.value = false
  }
}

const handleCancel = () => {
  router.back()
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

// 加载最近分享
const loadRecentShares = async () => {
  try {
    const userShares = await fetchUserShares()
    // 取最近5条分享
    recentShares.value = userShares.slice(0, 5).map(share => ({
      id: share.id,
      musicTitle: share.musicTitle,
      musicArtist: share.musicArtist,
      musicCover: share.musicCover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
      time: formatTime(share.createdAt)
    }))
  } catch (error) {
    console.error('加载最近分享失败:', error)
  }
}

onMounted(() => {
  // 页面初始化
  loadRecentShares()
})
</script>

<style scoped>
.share-create-page {
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

/* 主要内容 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

/* 编辑区域 */
.edit-card {
  border-radius: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.section-title .sub-title {
  font-size: 14px;
  font-weight: normal;
  color: #666;
}

/* 音乐选择 */
.search-box {
  margin-bottom: 20px;
}

.search-results {
  margin-bottom: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.results-count {
  font-size: 12px;
  color: #999;
}



.music-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.music-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-item:hover {
  border-color: #e8f4ff;
  background: #fffdf8;
}

.music-item.selected {
  border-color: #1890ff;
  background: #fffdf8;
}

.music-cover {
  position: relative;
  width: 50px;
  height: 50px;
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

.music-item:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay .el-icon {
  color: white;
  font-size: 16px;
}

.music-info {
  flex: 1;
}

.music-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.music-artist {
  margin: 0 0 2px 0;
  font-size: 12px;
  color: #666;
}

.music-album {
  margin: 0;
  font-size: 11px;
  color: #999;
}

.music-duration {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

/* 播放器样式 */
.music-player {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 加载状态 */
.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

/* 已选音乐 */
.selected-music-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fffdf8;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.selected-music-card .music-cover {
  width: 60px;
  height: 60px;
}

.music-details {
  flex: 1;
}

.music-details .music-title {
  font-size: 16px;
  margin-bottom: 6px;
}

.music-details .music-artist {
  font-size: 14px;
  margin-bottom: 4px;
}

.music-details .music-album {
  font-size: 12px;
}

/* 内容编辑器 */
.content-editor {
  margin: 24px 0;
}

/* 标签选择 */
.tags-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-tag-input {
  max-width: 200px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.selected-tags-title {
  font-size: 14px;
  color: #666;
}

.selected-tag {
  background: #1890ff;
  color: white;
}

/* 隐私设置 */
.privacy-settings {
  margin: 24px 0;
}

:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-radio) {
  align-items: flex-start;
}

.privacy-option {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
}

.privacy-option .el-icon {
  margin-top: 2px;
  color: #666;
}

.privacy-desc {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 指引区域 */
.guide-card,
.recent-shares-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.guide-header,
.recent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.guide-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.guide-text strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.guide-text p {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 最近分享 */
.recent-shares {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-share {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.recent-share:last-child {
  border-bottom: none;
}

.recent-music {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recent-music img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.recent-info {
  flex: 1;
}

.recent-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.recent-artist {
  font-size: 11px;
  color: #666;
}

.recent-time {
  font-size: 11px;
  color: #999;
}

.no-recent {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px 0;
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
  
  .selected-music-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>