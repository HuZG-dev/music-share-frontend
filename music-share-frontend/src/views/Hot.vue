<template>
  <div class="hot-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">热门</h1>
      <div class="filter-tabs">
        <span 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['tab-item', { active: activeFilter === filter.value }]"
          @click="switchFilter(filter.value)"
        >
          {{ filter.label }}
        </span>
      </div>
    </div>

    <!-- 分享列表 -->
    <div class="share-list">
      <div 
        v-for="(item, index) in displayList" 
        :key="item.id"
        class="share-item"
        @click="viewShare(item)"
      >
        <!-- 排名 -->
        <div class="rank-num" :class="{ top: index < 3 }">
          {{ index + 1 }}
        </div>

        <!-- 封面 -->
        <div class="cover">
          <img :src="item.musicCover" :alt="item.musicTitle">
          <div class="play-btn">
            <el-icon><VideoPlay /></el-icon>
          </div>
        </div>

        <!-- 信息 -->
        <div class="info">
          <div class="title">{{ item.musicTitle }}</div>
          <div class="artist">{{ item.musicArtist }}</div>
          <div class="meta">
            <span class="user">
              <el-avatar :size="18" :src="item.user?.avatar" />
              {{ item.user?.nickname || '匿名' }}
            </span>
            <span class="dot">·</span>
            <span class="stat"><el-icon><Star /></el-icon> {{ item.likedCount || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore" @click="loadMore">
        {{ loading ? '加载中...' : '加载更多' }}
      </div>
      
      <div class="no-more" v-else-if="displayList.length > 0">
        已经到底了
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Star } from '@element-plus/icons-vue'
import { fetchAllShares } from '@/api'

const router = useRouter()

// 筛选项
const filters = [
  { label: '最热', value: 'hot' },
  { label: '最新', value: 'new' },
  { label: '精选', value: 'featured' }
]

const activeFilter = ref('hot')
const loading = ref(false)
const pageSize = 10
const currentPage = ref(1)

// 分享数据
const shareData = ref([])

const sortedList = computed(() => {
  let sortedData = [...shareData.value]
  
  switch (activeFilter.value) {
    case 'hot':
      // 按点赞数排序（降序）
      sortedData.sort((a, b) => (b.likedCount || 0) - (a.likedCount || 0))
      break
    case 'new':
      // 按时间排序（降序）
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'featured':
      // 按收藏数排序（降序）
      sortedData.sort((a, b) => (b.collectedCount || 0) - (a.collectedCount || 0))
      break
  }
  
  return sortedData
})

const displayList = computed(() => {
  return sortedList.value.slice(0, currentPage.value * pageSize)
})

const hasMore = computed(() => {
  return displayList.value.length < sortedList.value.length
})

// 获取分享数据
const fetchShares = async () => {
  try {
    loading.value = true
    const response = await fetchAllShares()
    if (response && Array.isArray(response)) {
      shareData.value = response
    }
  } catch (error) {
    console.error('获取分享失败:', error)
  } finally {
    loading.value = false
  }
}

const getRankClass = (index) => {
  return index < 3 ? 'top' : ''
}

const formatCount = (count) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count
}

const viewShare = (item) => {
  router.push(`/share/${item.id}`)
}

const loadMore = () => {
  currentPage.value++
}

const switchFilter = (filterValue) => {
  activeFilter.value = filterValue
  currentPage.value = 1 // 切换筛选时重置页码
}

onMounted(() => {
  fetchShares()
})
</script>

<style scoped>
.hot-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 24px;
}

.tab-item {
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #666;
}

.tab-item.active {
  color: #333;
  font-weight: 500;
  border-bottom-color: #333;
}

.share-list {
  display: flex;
  flex-direction: column;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.share-item:hover {
  background: #fffdf8;
  margin: 0 -12px;
  padding: 16px 12px;
}

.rank-num {
  width: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #bbb;
  text-align: center;
  flex-shrink: 0;
}

.rank-num.top {
  color: #ff6b6b;
  font-weight: 700;
}

.cover {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover .play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
  font-size: 20px;
}

.share-item:hover .play-btn {
  opacity: 1;
}

.info {
  flex: 1;
  min-width: 0;
}

.info .title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info .artist {
  font-size: 13px;
  color: #999;
  margin-bottom: 6px;
}

.info .meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #bbb;
}

.info .user {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info .stat {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dot {
  color: #ddd;
}

.load-more {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.load-more:hover {
  color: #666;
}

.no-more {
  text-align: center;
  padding: 24px;
  color: #ccc;
  font-size: 13px;
}

@media (max-width: 640px) {
  .hot-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .cover {
    width: 48px;
    height: 48px;
  }
}
</style>