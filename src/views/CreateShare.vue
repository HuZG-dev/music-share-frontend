<template>
  <div class="share-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">发布分享</h1>
        <p class="page-subtitle">发现好音乐，分享你的感受</p>
      </div>
    </div>

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
                >
                  <template #append>
                    <el-button :icon="Search" @click="searchMusic" />
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
                        <el-icon><VideoPlay /></el-icon>
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

            <!-- 标签选择 -->
            <div class="tag-selector">
              <div class="section-title">
                添加标签
                <span class="sub-title">（可选，最多5个）</span>
              </div>
              <div class="tags-container">
                <!-- 热门标签 -->
                <div class="popular-tags">
                  <el-tag
                    v-for="tag in popularTags"
                    :key="tag"
                    :type="selectedTags.includes(tag) ? 'primary' : 'info'"
                    class="tag-item"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                
                <!-- 自定义标签 -->
                <div class="custom-tag-input">
                  <el-input
                    v-model="customTag"
                    placeholder="输入自定义标签"
                    size="small"
                    @keyup.enter="addCustomTag"
                  >
                    <template #append>
                      <el-button @click="addCustomTag">添加</el-button>
                    </template>
                  </el-input>
                </div>
                
                <!-- 已选标签 -->
                <div v-if="selectedTags.length > 0" class="selected-tags">
                  <div class="selected-tags-title">已选标签：</div>
                  <el-tag
                    v-for="tag in selectedTags"
                    :key="tag"
                    closable
                    @close="removeTag(tag)"
                    class="selected-tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
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
                  <strong>添加标签</strong>
                  <p>使用标签让更多人发现你的分享</p>
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

const router = useRouter()

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref([])
const selectedMusic = ref(null)

// 分享内容
const shareContent = ref('')
const selectedTags = ref([])
const customTag = ref('')
const privacy = ref('public')
const publishing = ref(false)

// 热门标签
const popularTags = ref([
  '单曲循环', '深夜emo', '运动必备', '学习专注',
  '经典老歌', '新歌推荐', '治愈系', '摇滚',
  '流行', '民谣', '电子', '爵士'
])

// 最近分享（模拟数据）
const recentShares = ref([
  {
    id: 1,
    musicTitle: '晴天',
    musicArtist: '周杰伦',
    musicCover: 'https://via.placeholder.com/40x40/667eea/ffffff',
    time: '2小时前'
  },
  {
    id: 2,
    musicTitle: '起风了',
    musicArtist: '买辣椒也用券',
    musicCover: 'https://via.placeholder.com/40x40/764ba2/ffffff',
    time: '1天前'
  }
])

// 计算属性：是否可以发布
const canPublish = computed(() => {
  return selectedMusic.value && shareContent.value.trim().length > 0
})

// 方法
const handleSearchInput = () => {
  // 防抖搜索，可以后续优化
}

const searchMusic = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    // 模拟搜索API调用
    searchResults.value = [
      {
        id: 'qq_123456',
        title: '晴天',
        artist: '周杰伦',
        album: '叶惠美',
        cover: 'https://via.placeholder.com/60x60/667eea/ffffff',
        duration: 269,
        source: 'qqmusic'
      },
      {
        id: 'qq_123457',
        title: '晴天 (Live)',
        artist: '周杰伦',
        album: 'The One演唱会',
        cover: 'https://via.placeholder.com/60x60/764ba2/ffffff',
        duration: 285,
        source: 'qqmusic'
      }
    ]
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  }
}

const clearSearchResults = () => {
  searchResults.value = []
}

const selectMusic = (music) => {
  selectedMusic.value = music
}

const clearSelection = () => {
  selectedMusic.value = null
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    if (selectedTags.value.length < 5) {
      selectedTags.value.push(tag)
    } else {
      ElMessage.warning('最多只能选择5个标签')
    }
  }
}

const addCustomTag = () => {
  if (!customTag.value.trim()) {
    ElMessage.warning('请输入标签内容')
    return
  }

  if (selectedTags.value.length >= 5) {
    ElMessage.warning('最多只能添加5个标签')
    return
  }

  if (!selectedTags.value.includes(customTag.value)) {
    selectedTags.value.push(customTag.value)
    customTag.value = ''
  } else {
    ElMessage.warning('该标签已存在')
  }
}

const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
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
    // 模拟发布API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('分享发布成功！')
    router.push('/')
  } catch (error) {
    ElMessage.error('发布失败，请重试')
  } finally {
    publishing.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  // 页面初始化
})
</script>

<style scoped>
.share-create-page {
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

/* 主要内容 */
.main-content {
  max-width: 1200px;
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
  background: #f8fafc;
}

.music-item.selected {
  border-color: #1890ff;
  background: #f0f7ff;
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

/* 已选音乐 */
.selected-music-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
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
.gide-card,
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