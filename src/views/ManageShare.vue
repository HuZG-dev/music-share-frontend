<template>
  <div class="share-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">分享管理</h1>
        <p class="page-subtitle">管理你发布的音乐分享</p>
        <div class="header-actions">
          <el-button type="primary" :icon="Plus" @click="goToCreateShare">
            发布新分享
          </el-button>
          <el-button :type="checkingShares ? 'info' : 'warning'" :icon="checkingShares ? 'Loading' : 'Warning'" :disabled="checkingShares || shares.length === 0" @click="checkAllSharesAvailability">
            {{ checkingShares ? `检查中(${checkProgress}%)` : '检查无效分享' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 统计卡片 -->
        <div class="stats-cards">
          <el-row :gutter="16">
            <el-col :xs="12" :sm="6">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon total">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ stats.total }}</div>
                    <div class="stat-label">总分享</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="12" :sm="6">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon public">
                    <el-icon><View /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ stats.public }}</div>
                    <div class="stat-label">公开分享</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="12" :sm="6">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon likes">
                    <el-icon><Star /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ formatCount(stats.totalLikes) }}</div>
                    <div class="stat-label">总获赞</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :xs="12" :sm="6">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon comments">
                    <el-icon><ChatDotRound /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ formatCount(stats.totalComments) }}</div>
                    <div class="stat-label">总评论</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 筛选和搜索 -->
        <el-card class="filter-card">
          <div class="filter-content">
            <div class="filter-left">
              <el-input
                v-model="filter.keyword"
                placeholder="搜索分享内容或音乐..."
                class="search-input"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button :icon="Search" @click="handleSearch" />
                </template>
              </el-input>
              
              <el-select
                v-model="filter.privacy"
                placeholder="隐私设置"
                clearable
                @change="handleFilterChange"
              >
                <el-option label="公开" value="public" />
                <el-option label="仅好友可见" value="friends" />
                <el-option label="私密" value="private" />
              </el-select>

              <el-select
                v-model="filter.status"
                placeholder="状态"
                clearable
                @change="handleFilterChange"
              >
                <el-option label="正常" value="normal" />
                <el-option label="已删除" value="deleted" />
              </el-select>
            </div>
            
            <div class="filter-right">
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </div>
          </div>
        </el-card>

        <!-- 分享列表 -->
        <el-card class="shares-card">
          <template #header>
            <div class="shares-header">
              <span>我的分享</span>
              <span class="shares-count">共 {{ shares.length }} 条分享</span>
            </div>
          </template>

          <div class="shares-list">
            <div
              v-for="share in shares"
              :key="share.id"
              class="share-item"
              :class="{ deleted: share.status === 'deleted' }"
            >
              <!-- 音乐信息 -->
              <div class="music-info">
                <div class="music-cover">
                  <img :src="share.musicInfo.cover" :alt="share.musicInfo.title" />
                  <div class="cover-overlay" @click="playMusic(share.musicInfo)">
                    <el-icon><VideoPlay /></el-icon>
                  </div>
                </div>
                <div class="music-details">
                  <h4 class="music-title">{{ share.musicInfo.title }}</h4>
                  <p class="music-artist">{{ share.musicInfo.artist }}</p>
                  <p class="music-album">{{ share.musicInfo.album }}</p>
                </div>
              </div>

              <!-- 分享内容 -->
              <div class="share-content">
                <p class="content-text">{{ share.content }}</p>
                <div class="share-tags">
                  <el-tag
                    v-for="tag in share.tags"
                    :key="tag"
                    size="small"
                    class="content-tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="share-meta">
                  <span class="meta-item">
                    <el-icon><Clock /></el-icon>
                    {{ formatTime(share.createdAt) }}
                  </span>
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ share.privacy === 'public' ? '公开' : share.privacy === 'friends' ? '仅好友' : '私密' }}
                  </span>
                  <span v-if="share.status === 'deleted'" class="status-deleted">
                    <el-icon><Warning /></el-icon>
                    已删除
                  </span>
                </div>
              </div>

              <!-- 互动数据 -->
              <div class="interaction-stats">
                <div class="stat-item">
                  <el-icon><Star /></el-icon>
                  <span>{{ formatCount(share.likes) }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ formatCount(share.comments) }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Share /></el-icon>
                  <span>{{ formatCount(share.shares) }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <el-button
                  v-if="share.status !== 'deleted'"
                  type="primary"
                  link
                  :icon="Edit"
                  @click="handleEdit(share)"
                >
                  编辑
                </el-button>
                
                <el-dropdown v-if="share.status !== 'deleted'" trigger="click">
                  <el-button type="primary" link :icon="More" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleChangePrivacy(share)">
                        <el-icon><Setting /></el-icon>
                        修改隐私
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="share.privacy !== 'public'"
                        @click="handleMakePublic(share)"
                      >
                        <el-icon><View /></el-icon>
                        设为公开
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="handleDelete(share)">
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <el-button
                  v-if="share.status === 'deleted'"
                  type="primary"
                  link
                  :icon="Refresh"
                  @click="handleRestore(share)"
                >
                  恢复
                </el-button>
                
                <el-button
                  v-if="share.status === 'deleted'"
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handlePermanentDelete(share)"
                >
                  永久删除
                </el-button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="shares.length === 0" class="empty-state">
              <el-empty description="暂无分享记录">
                <el-button type="primary" @click="goToCreateShare">
                  发布第一个分享
                </el-button>
              </el-empty>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="shares.length > 0" class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.current"
              v-model:page-size="pagination.size"
              :total="pagination.total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 编辑分享对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑分享"
      width="600px"
      :before-close="handleCloseEditDialog"
    >
      <share-editor
        v-if="editDialogVisible"
        :share="editingShare"
        @save="handleSaveEdit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>

    <!-- 修改隐私对话框 -->
    <el-dialog
      v-model="privacyDialogVisible"
      title="修改隐私设置"
      width="400px"
    >
      <div class="privacy-dialog">
        <el-radio-group v-model="selectedPrivacy">
          <el-radio value="public">
            <div class="privacy-option">
              <el-icon><View /></el-icon>
              <div>
                <div class="privacy-title">公开</div>
                <div class="privacy-desc">所有用户可见</div>
              </div>
            </div>
          </el-radio>
          <el-radio value="friends">
            <div class="privacy-option">
              <el-icon><User /></el-icon>
              <div>
                <div class="privacy-title">仅好友可见</div>
                <div class="privacy-desc">只有你的好友可以看到</div>
              </div>
            </div>
          </el-radio>
          <el-radio value="private">
            <div class="privacy-option">
              <el-icon><Lock /></el-icon>
              <div>
                <div class="privacy-title">私密</div>
                <div class="privacy-desc">仅自己可见</div>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="privacyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmPrivacy">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { fetchUserShares, deleteShare } from '@/api'
import { Plus, Search, Refresh, Document, View, Star, ChatDotRound, VideoPlay, Clock, Warning, Share, Edit, More, Setting, Delete, User, Lock, Loading } from '@element-plus/icons-vue'
import { isMusicAvailable } from '@/api/netease'

const router = useRouter()

// 数据
const shares = ref([])
const stats = reactive({
  total: 0,
  public: 0,
  totalLikes: 0,
  totalComments: 0
})

// 筛选条件
const filter = reactive({
  keyword: '',
  privacy: '',
  status: ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 对话框状态
const editDialogVisible = ref(false)
const privacyDialogVisible = ref(false)
const editingShare = ref(null)
const selectedPrivacy = ref('public')
const currentShareId = ref(null)

// 检查音乐可获取性相关状态
const checkingShares = ref(false)
const unavailableShares = ref([])
const checkProgress = ref(0)

// 计算属性
const filteredShares = computed(() => {
  return shares.value.filter(share => {
    const matchesKeyword = !filter.keyword || 
      share.content.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      share.musicInfo.title.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      share.musicInfo.artist.toLowerCase().includes(filter.keyword.toLowerCase())
    
    const matchesPrivacy = !filter.privacy || share.privacy === filter.privacy
    const matchesStatus = !filter.status || share.status === filter.status
    
    return matchesKeyword && matchesPrivacy && matchesStatus
  })
})

// 方法
// 检查所有分享的音乐可获取性
const checkAllSharesAvailability = async () => {
  if (shares.value.length === 0) {
    ElMessage.warning('没有分享可以检查')
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: '正在检查音乐可获取性...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  checkingShares.value = true
  unavailableShares.value = []
  checkProgress.value = 0

  try {
    const sharesToCheck = [...shares.value]
    const totalShares = sharesToCheck.length

    for (let i = 0; i < totalShares; i++) {
      const share = sharesToCheck[i]
      checkProgress.value = Math.round(((i + 1) / totalShares) * 100)

      // 检查音乐是否可获取
      const isAvailable = await isMusicAvailable(share.musicInfo.id)

      // 如果音乐不可获取，添加到待删除列表
      if (!isAvailable) {
        unavailableShares.value.push(share)
      }

      // 延迟一下，避免请求过于频繁
      if (i < totalShares - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    loading.close()
    checkingShares.value = false

    if (unavailableShares.value.length > 0) {
      ElMessage.success(`检查完成，发现 ${unavailableShares.value.length} 个分享的音乐无法获取`)
      
      // 询问用户是否删除这些分享
      await handleDeleteUnavailableShares()
    } else {
      ElMessage.success('检查完成，所有分享的音乐都可以正常获取')
    }
  } catch (error) {
    console.error('检查音乐可获取性失败:', error)
    loading.close()
    checkingShares.value = false
    ElMessage.error('检查音乐可获取性失败')
  }
}

// 删除所有无法获取音乐的分享
const handleDeleteUnavailableShares = async () => {
  if (unavailableShares.value.length === 0) {
    return
  }

  try {
    await ElMessageBox.confirm(
      `发现 ${unavailableShares.value.length} 个分享的音乐无法获取，确定要删除这些分享吗？`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const loading = ElLoading.service({
      lock: true,
      text: '正在删除无法获取的分享...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 批量删除无法获取的分享
    for (const share of unavailableShares.value) {
      await deleteShare(share.id)
      
      // 从本地分享列表中移除
      const index = shares.value.findIndex(s => s.id === share.id)
      if (index !== -1) {
        shares.value.splice(index, 1)
      }
    }

    loading.close()
    unavailableShares.value = []
    updateStats()
    ElMessage.success(`成功删除 ${unavailableShares.value.length} 个无法获取音乐的分享`)
  } catch (error) {
    // 用户取消删除或删除失败
    if (error !== 'cancel') {
      console.error('删除无法获取的分享失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 加载分享
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
        cover: share.musicCover,
        duration: 0, // 后端可能没有提供，设置默认值
        source: 'qqmusic' // 默认来源
      },
      content: share.content,
      tags: share.tags ? share.tags.split(',') : [],
      privacy: share.privacy || 'public',
      status: 'normal', // 后端可能没有提供状态字段，默认为正常
      likes: share.likes || 0,
      comments: share.comments || 0,
      shares: share.shares || 0,
      createdAt: share.createdAt
    }))
    
    // 更新统计
    updateStats()
    
    // 加载完成后自动检查音乐可获取性
    // 注释掉自动检查，用户可以手动触发检查
    // setTimeout(() => {
    //   checkAllSharesAvailability()
    // }, 1000)
  } catch (error) {
    console.error('加载分享失败:', error)
    ElMessage.error('加载分享失败')
  }
}

const updateStats = () => {
  stats.total = shares.value.length
  stats.public = shares.value.filter(s => s.privacy === 'public').length
  stats.totalLikes = shares.value.reduce((sum, share) => sum + share.likes, 0)
  stats.totalComments = shares.value.reduce((sum, share) => sum + share.comments, 0)
}

const handleSearch = () => {
  pagination.current = 1
  // 实际项目中这里会调用API
}

const handleFilterChange = () => {
  pagination.current = 1
  // 实际项目中这里会调用API
}

const handleReset = () => {
  filter.keyword = ''
  filter.privacy = ''
  filter.status = ''
  pagination.current = 1
  // 重新加载数据
}

const handleEdit = (share) => {
  editingShare.value = { ...share }
  editDialogVisible.value = true
}

const handleSaveEdit = async (updatedShare) => {
  try {
    // 调用API更新分享
    const index = shares.value.findIndex(s => s.id === updatedShare.id)
    if (index !== -1) {
      shares.value[index] = { ...shares.value[index], ...updatedShare }
    }
    editDialogVisible.value = false
    ElMessage.success('分享更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleCloseEditDialog = () => {
  editDialogVisible.value = false
}

const handleChangePrivacy = (share) => {
  currentShareId.value = share.id
  selectedPrivacy.value = share.privacy
  privacyDialogVisible.value = true
}

const handleMakePublic = async (share) => {
  try {
    // 调用API修改隐私设置
    share.privacy = 'public'
    ElMessage.success('已设为公开')
    updateStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleConfirmPrivacy = async () => {
  try {
    const share = shares.value.find(s => s.id === currentShareId.value)
    if (share) {
      share.privacy = selectedPrivacy.value
      ElMessage.success('隐私设置已更新')
      updateStats()
    }
    privacyDialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const handleDelete = async (share) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条分享吗？删除后可以从回收站恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    share.status = 'deleted'
    ElMessage.success('分享已移至回收站')
    updateStats()
  } catch (error) {
    // 用户取消删除
  }
}

const handleRestore = async (share) => {
  try {
    share.status = 'normal'
    ElMessage.success('分享已恢复')
    updateStats()
  } catch (error) {
    ElMessage.error('恢复失败')
  }
}

const handlePermanentDelete = async (share) => {
  try {
    await ElMessageBox.confirm(
      '确定要永久删除这条分享吗？此操作不可恢复。',
      '确认永久删除',
      {
        confirmButtonText: '永久删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const index = shares.value.findIndex(s => s.id === share.id)
    if (index !== -1) {
      shares.value.splice(index, 1)
    }
    ElMessage.success('分享已永久删除')
    updateStats()
  } catch (error) {
    // 用户取消删除
  }
}

const playMusic = (musicInfo) => {
  console.log('播放音乐:', musicInfo.title)
  // 实现播放逻辑
}

const goToCreateShare = () => {
  router.push('/create-share')
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

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

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  // 重新加载数据
}

const handleCurrentChange = (page) => {
  pagination.current = page
  // 重新加载数据
}

onMounted(() => {
  loadShares()
})
</script>

<style scoped>
.share-management-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 统计卡片 */
.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon.public {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
}

.stat-icon.likes {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.stat-icon.comments {
  background: linear-gradient(135deg, #45b7d1, #3a9bb0);
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 筛选卡片 */
.filter-card {
  border-radius: 12px;
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.search-input {
  width: 300px;
}

/* 分享列表 */
.shares-card {
  border-radius: 12px;
}

.shares-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shares-count {
  font-size: 14px;
  color: #666;
}

.shares-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-item {
  display: grid;
  grid-template-columns: 200px 1fr auto auto;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background: white;
  transition: all 0.3s ease;
}

.share-item:hover {
  border-color: #e8f4ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.share-item.deleted {
  opacity: 0.6;
  background: #fafafa;
}

/* 音乐信息 */
.music-info {
  display: flex;
  gap: 12px;
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
  cursor: pointer;
}

.music-cover:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay .el-icon {
  color: white;
  font-size: 16px;
}

.music-details {
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

/* 分享内容 */
.share-content {
  flex: 1;
}

.content-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.share-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.content-tag {
  font-size: 11px;
}

.share-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-deleted {
  color: #ff4d4f;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 互动数据 */
.interaction-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 80px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.stat-item .el-icon {
  font-size: 14px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100px;
}

/* 隐私对话框 */
.privacy-dialog {
  padding: 8px 0;
}

.privacy-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.privacy-option:hover {
  background: #f5f5f5;
}

.privacy-option .el-icon {
  margin-top: 2px;
  color: #666;
  font-size: 18px;
}

.privacy-title {
  font-weight: 500;
  margin-bottom: 2px;
}

.privacy-desc {
  font-size: 12px;
  color: #999;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .share-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .music-info {
    justify-content: flex-start;
  }
  
  .interaction-stats {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .action-buttons {
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-left {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .page-title {
    font-size: 24px;
  }
}
</style>