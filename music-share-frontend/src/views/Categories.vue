<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VideoPlay, Star } from '@element-plus/icons-vue'
import { fetchAllShares } from '@/api'

const router = useRouter()
const route = useRoute()

// 音乐分类数据
const musicCategories = ref([
  {
    id: 1,
    name: '流行',
    icon: '🎵',
    description: '最新最热的流行歌曲',
    cover: 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg',
    color: '#e07c5c',
    count: 12543
  },
  {
    id: 2,
    name: '民谣',
    icon: '🌿',
    description: '温暖人心的民谣歌曲',
    cover: 'https://p1.music.126.net/m4aO0eQj8Cv38YqF6V4Uyw==/109951163462725661.jpg',
    color: '#4ecdc4',
    count: 5432
  },
  {
    id: 3,
    name: 'R&B',
    icon: '🎶',
    description: '节奏蓝调，情感充沛',
    cover: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg',
    color: '#ff9ff3',
    count: 3890
  },
  {
    id: 4,
    name: '说唱',
    icon: '🎤',
    description: '节奏感十足的说唱音乐',
    cover: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg',
    color: '#ff6b6b',
    count: 4876
  },
  {
    id: 5,
    name: '摇滚',
    icon: '🎸',
    description: '激情四射的摇滚乐曲',
    cover: 'https://p2.music.126.net/8oW1h4T586uL9I08lJqgMg==/109951164239389148.jpg',
    color: '#764ba2',
    count: 8765
  },
  {
    id: 6,
    name: '轻音',
    icon: '🎼',
    description: '放松身心的轻音乐',
    cover: 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg',
    color: '#ffcc5c',
    count: 4123
  }
])

// 当前选中的分类
const activeCategory = ref(null)

// 当前选中的分类名称（用于导航栏）
const activeCategoryName = ref('')

// 分类下的分享数据
const categoryShares = ref([])

// 获取分类下的分享数据
const loadCategoryShares = async (categoryId, categoryName) => {
  try {
    const allShares = await fetchAllShares()
    // 模拟按分类过滤（实际应由后端实现）
    // 这里使用categoryName来过滤具有相同音乐分类的分享
    categoryShares.value = allShares.filter(share => 
      share.musicCategory === categoryName
    ).slice(0, 10)
  } catch (error) {
    console.error('获取分类分享失败:', error)
  }
}

// 方法
const selectCategory = (category) => {
  activeCategory.value = category
  activeCategoryName.value = category.name
  loadCategoryShares(category.id, category.name)
}

// 处理分类导航栏点击事件
const handleCategoryChange = (tab) => {
  const categoryName = tab.props.name
  const category = musicCategories.value.find(cat => cat.name === categoryName)
  if (category) {
    activeCategory.value = category
    loadCategoryShares(category.id, category.name)
  }
}

const viewShare = (share) => {
  router.push(`/share/${share.id}`)
}

// 移除goBackToCategories函数，不再需要返回分类列表

// 移除hotCategories和otherCategories计算属性

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

onMounted(() => {
  // 检查 URL 参数是否有分类
  const catParam = route.query.cat
  if (catParam) {
    const category = musicCategories.value.find(cat => cat.name === catParam)
    if (category) {
      selectCategory(category)
      return
    }
  }
  // 默认选中第一个分类
  if (musicCategories.value.length > 0) {
    selectCategory(musicCategories.value[0])
  }
})
</script>

<template>
  <div class="music-categories-page">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分类详情模式 - 直接显示，不再有条件判断 -->
      <div class="category-detail-mode">
        <!-- 分类头部 -->
        <div class="category-header">
          <div class="header-content">
            <div class="category-avatar" :style="{ backgroundColor: activeCategory?.color }">
              {{ activeCategory?.icon }}
            </div>
            <div class="header-info">
              <h1 class="category-title">{{ activeCategory?.name }}</h1>
              <p class="category-description">{{ activeCategory?.description }}</p>
            </div>
          </div>
        </div>

        <!-- 分类导航栏 -->
        <div class="category-nav">
          <el-tabs v-model="activeCategoryName" type="card" @tab-click="handleCategoryChange">
            <el-tab-pane 
              v-for="category in musicCategories" 
              :key="category.id" 
              :label="category.name" 
              :name="category.name"
            >
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 分类分享列表 -->
        <section class="section">
          <div class="section-header">
            <h3 class="section-title">热门分享</h3>
          </div>
          
          <div class="shares-list">
            <div
              v-for="(share, index) in categoryShares"
              :key="share.id"
              class="share-item"
              @click="viewShare(share)"
            >
              <div class="share-order">
                <span class="order-number">{{ index + 1 }}</span>
              </div>
              
              <div class="share-cover">
                <img :src="share.musicCover || 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/7942152268854681.jpg'" :alt="share.musicTitle" />
                <div class="cover-overlay">
                  <el-icon :size="20" class="play-icon"><VideoPlay /></el-icon>
                </div>
              </div>
              
              <div class="share-info">
                <h4 class="share-title">{{ share.musicTitle }}</h4>
                <p class="artist-name">{{ share.musicArtist }}</p>
                <div class="user-line">
                  <el-avatar :size="16" :src="share.user?.avatar || '/src/assets/default-avatar.png'" />
                  <span class="user-name">{{ share.user?.nickname || '未知用户' }}</span>
                </div>
                <p class="share-content">{{ share.content }}</p>
              </div>
              
              <div class="share-stats">
                <span class="stat-item">
                  <el-icon><Headset /></el-icon>
                  {{ formatCount(share.playCount || 0) }}
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ formatCount(share.likedCount || 0) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-categories-page {
  background-color: #fffdf8;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 40px 0 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 32px;
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
  padding: 30px 20px;
}

/* 区块通用样式 */
.section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 热门分类网格 */
.hot-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.hot-category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.hot-category-card:hover {
  border-color: #e07c5c;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  color: white;
}

.category-info {
  flex: 1;
}

.category-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.category-desc {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.song-count {
  font-size: 13px;
  color: #999;
}

.play-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fffdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e07c5c;
  transition: all 0.3s ease;
}

.hot-category-card:hover .play-button {
  background: #e07c5c;
  color: white;
}

/* 所有分类网格 */
.all-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.category-item:hover {
  background: #fffdf8;
  border-color: #e8e8e8;
}

.item-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-count {
  font-size: 12px;
  color: #999;
}

/* 分类详情头部 */
.category-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.back-button {
  margin-bottom: 20px;
  color: #666;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.category-avatar {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  text-align: center;
  padding-right: 100px; /* 补偿左侧图标宽度，让标题视觉居中 */
}

.category-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.category-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

.category-stats {
  font-size: 13px;
  color: #999;
}

/* 分类导航栏 */
.category-nav {
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.category-nav :deep(.el-tabs__header) {
  margin: 0;
}

.category-nav :deep(.el-tabs__nav-wrap) {
  overflow-x: auto;
  overflow-y: hidden;
}

.category-nav :deep(.el-tabs__nav) {
  flex-wrap: nowrap;
  gap: 8px;
}

.category-nav :deep(.el-tabs__item) {
  white-space: nowrap;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.category-nav :deep(.el-tabs__item.is-active) {
  background-color: #e07c5c;
  color: white;
}

.category-nav :deep(.el-tabs__item:hover) {
  color: #e07c5c;
}

.category-nav :deep(.el-tabs__item.is-active:hover) {
  color: white;
}

/* 分享列表 */
.shares-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.share-item {
  display: grid;
  grid-template-columns: 40px 50px 1fr 120px;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.share-item:last-child {
  border-bottom: none;
}

.share-item:hover {
  background: #fffdf8;
  border-radius: 6px;
}

.share-order {
  text-align: center;
}

.order-number {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.share-cover {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.share-cover img {
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
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.share-item:hover .cover-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
}

.share-info {
  flex: 1;
  min-width: 0;
}

.share-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-name {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #666;
}

.user-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.user-name {
  font-size: 11px;
  color: #999;
}

.share-content {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.share-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #999;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item .el-icon {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .section {
    padding: 20px;
    border-radius: 8px;
  }
  
  .hot-categories-grid {
    grid-template-columns: 1fr;
  }
  
  .all-categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .share-item {
    grid-template-columns: 30px 40px 1fr auto;
    gap: 12px;
    padding: 12px;
  }
  
  .share-stats {
    display: none;
  }
}

@media (max-width: 480px) {
  .all-categories-grid {
    grid-template-columns: 1fr;
  }
  
  .hot-category-card {
    padding: 16px;
  }
  
  .category-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .category-name {
    font-size: 16px;
  }
}
</style>