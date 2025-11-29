<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Star, Share } from '@element-plus/icons-vue'

const router = useRouter()

// 音乐分类数据
const musicCategories = ref([
  {
    id: 1,
    name: '流行音乐',
    icon: '🎵',
    description: '最新最热的流行歌曲',
    cover: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Pop',
    color: '#667eea',
    count: 12543
  },
  {
    id: 2,
    name: '摇滚',
    icon: '🎸',
    description: '激情四射的摇滚乐曲',
    cover: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Rock',
    color: '#764ba2',
    count: 8765
  },
  {
    id: 3,
    name: '电子',
    icon: '🎧',
    description: '动感电子音乐',
    cover: 'https://via.placeholder.com/300x200/f093fb/ffffff?text=EDM',
    color: '#f093fb',
    count: 6342
  },
  {
    id: 4,
    name: '民谣',
    icon: '🌿',
    description: '温暖人心的民谣歌曲',
    cover: 'https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Folk',
    color: '#4ecdc4',
    count: 5432
  },
  {
    id: 5,
    name: '说唱',
    icon: '🎤',
    description: '节奏感十足的说唱音乐',
    cover: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Rap',
    color: '#ff6b6b',
    count: 4876
  },
  {
    id: 6,
    name: '古典',
    icon: '🎻',
    description: '经典古典音乐作品',
    cover: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Classical',
    color: '#45b7d1',
    count: 3210
  },
  {
    id: 7,
    name: '爵士',
    icon: '🎷',
    description: '优雅爵士乐',
    cover: 'https://via.placeholder.com/300x200/96ceb4/ffffff?text=Jazz',
    color: '#96ceb4',
    count: 2987
  },
  {
    id: 8,
    name: '轻音乐',
    icon: '🎼',
    description: '放松身心的轻音乐',
    cover: 'https://via.placeholder.com/300x200/ffcc5c/ffffff?text=Light',
    color: '#ffcc5c',
    count: 4123
  },
  {
    id: 9,
    name: '影视原声',
    icon: '🎬',
    description: '经典影视配乐',
    cover: 'https://via.placeholder.com/300x200/588c7e/ffffff?text=OST',
    color: '#588c7e',
    count: 3567
  },
  {
    id: 10,
    name: '游戏音乐',
    icon: '🎮',
    description: '游戏背景音乐',
    cover: 'https://via.placeholder.com/300x200/d96459/ffffff?text=Game',
    color: '#d96459',
    count: 2890
  },
  {
    id: 11,
    name: '民族音乐',
    icon: '🎪',
    description: '各民族传统音乐',
    cover: 'https://via.placeholder.com/300x200/f2e394/ffffff?text=Ethnic',
    color: '#f2e394',
    count: 1876
  },
  {
    id: 12,
    name: '纯音乐',
    icon: '🎹',
    description: '无歌词纯器乐作品',
    cover: 'https://via.placeholder.com/300x200/87a7b4/ffffff?text=Instrumental',
    color: '#87a7b4',
    count: 5234
  }
])

// 当前选中的分类
const activeCategory = ref(null)

// 分类下的热门音乐
const categorySongs = ref([])

// 方法
const selectCategory = (category) => {
  activeCategory.value = category
  loadCategorySongs(category.id)
}

const loadCategorySongs = (categoryId) => {
  categorySongs.value = [
    {
      id: 1,
      name: '热门歌曲示例 1',
      artist: '知名歌手',
      cover: 'https://via.placeholder.com/80x80/667eea/ffffff',
      duration: '04:15',
      playCount: 123456,
      liked: false,
      likeCount: 2345
    },
    {
      id: 2,
      name: '热门歌曲示例 2',
      artist: '实力唱将',
      cover: 'https://via.placeholder.com/80x80/764ba2/ffffff',
      duration: '03:45',
      playCount: 98765,
      liked: true,
      likeCount: 1876
    },
    {
      id: 3,
      name: '热门歌曲示例 3',
      artist: '新晋艺人',
      cover: 'https://via.placeholder.com/80x80/f093fb/ffffff',
      duration: '03:20',
      playCount: 87654,
      liked: false,
      likeCount: 1543
    },
    {
      id: 4,
      name: '热门歌曲示例 4',
      artist: '独立音乐人',
      cover: 'https://via.placeholder.com/80x80/4ecdc4/ffffff',
      duration: '03:55',
      playCount: 76543,
      liked: false,
      likeCount: 1321
    },
    {
      id: 5,
      name: '热门歌曲示例 5',
      artist: '乐队组合',
      cover: 'https://via.placeholder.com/80x80/ff6b6b/ffffff',
      duration: '04:10',
      playCount: 65432,
      liked: true,
      likeCount: 1198
    }
  ]
}

const playMusic = (song) => {
  console.log('播放音乐:', song.name)
}

const toggleLike = (song) => {
  song.liked = !song.liked
  song.likeCount += song.liked ? 1 : -1
}

const handleShare = (song) => {
  console.log('分享音乐:', song.name)
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

const goBackToCategories = () => {
  activeCategory.value = null
  categorySongs.value = []
}

// 热门分类（前6个）
const hotCategories = computed(() => musicCategories.value.slice(0, 6))

// 其他分类
const otherCategories = computed(() => musicCategories.value.slice(6))

onMounted(() => {
  // 初始化代码
})
</script>

<template>
  <div class="music-categories-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">音乐分类</h1>
        <p class="page-subtitle">探索不同风格的音乐世界</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分类浏览模式 -->
      <div v-if="!activeCategory" class="categories-mode">
        <!-- 热门分类 -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">热门分类</h2>
          </div>
          
          <div class="hot-categories-grid">
            <div
              v-for="category in hotCategories"
              :key="category.id"
              class="hot-category-card"
              @click="selectCategory(category)"
            >
              <div class="category-icon" :style="{ backgroundColor: category.color }">
                {{ category.icon }}
              </div>
              <div class="category-info">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-desc">{{ category.description }}</p>
                <span class="song-count">{{ formatCount(category.count) }} 首</span>
              </div>
              <div class="play-button">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
          </div>
        </section>

        <!-- 所有分类 -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">所有分类</h2>
          </div>
          
          <div class="all-categories-grid">
            <div
              v-for="category in otherCategories"
              :key="category.id"
              class="category-item"
              @click="selectCategory(category)"
            >
              <div class="item-icon" :style="{ color: category.color }">
                {{ category.icon }}
              </div>
              <div class="item-info">
                <span class="item-name">{{ category.name }}</span>
                <span class="item-count">{{ formatCount(category.count) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 分类详情模式 -->
      <div v-if="activeCategory" class="category-detail-mode">
        <!-- 分类头部 -->
        <div class="category-header">
          <el-button 
            type="primary" 
            link 
            @click="goBackToCategories"
            class="back-button"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回分类
          </el-button>
          
          <div class="header-content">
            <div class="category-avatar" :style="{ backgroundColor: activeCategory.color }">
              {{ activeCategory.icon }}
            </div>
            <div class="header-info">
              <h1 class="category-title">{{ activeCategory.name }}</h1>
              <p class="category-description">{{ activeCategory.description }}</p>
              <div class="category-stats">
                <span class="stat-item">{{ formatCount(activeCategory.count) }} 首歌曲</span>
              </div>
            </div>
            <el-button type="primary" class="play-all-btn">
              <el-icon><VideoPlay /></el-icon>
              播放全部
            </el-button>
          </div>
        </div>

        <!-- 分类歌曲列表 -->
        <section class="section">
          <div class="section-header">
            <h3 class="section-title">热门歌曲</h3>
          </div>
          
          <div class="songs-list">
            <div
              v-for="(song, index) in categorySongs"
              :key="song.id"
              class="song-item"
              @click="playMusic(song)"
            >
              <div class="song-order">
                <span class="order-number">{{ index + 1 }}</span>
              </div>
              
              <div class="song-cover">
                <img :src="song.cover" :alt="song.name" />
              </div>
              
              <div class="song-info">
                <h4 class="song-title">{{ song.name }}</h4>
                <p class="artist-name">{{ song.artist }}</p>
              </div>
              
              <div class="song-stats">
                <span class="play-count">{{ formatCount(song.playCount) }} 播放</span>
              </div>
              
              <div class="song-duration">{{ song.duration }}</div>
              
              <div class="song-actions">
                <el-button 
                  size="small" 
                  :icon="Star" 
                  :type="song.liked ? 'primary' : ''"
                  @click.stop="toggleLike(song)"
                  class="like-btn"
                >
                  {{ song.likeCount }}
                </el-button>
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
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 40px 0 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1200px;
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
  max-width: 1200px;
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
  border-color: #667eea;
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
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  transition: all 0.3s ease;
}

.hot-category-card:hover .play-button {
  background: #667eea;
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
  background: #f8f9fa;
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

.play-all-btn {
  flex-shrink: 0;
}

/* 歌曲列表 */
.songs-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.song-item {
  display: grid;
  grid-template-columns: 40px 50px 1fr 100px 80px 100px;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.song-item:last-child {
  border-bottom: none;
}

.song-item:hover {
  background: #f8f9fa;
  border-radius: 6px;
}

.song-order {
  text-align: center;
}

.order-number {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  flex: 1;
}

.song-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.artist-name {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.song-stats {
  font-size: 13px;
  color: #999;
  text-align: center;
}

.song-duration {
  font-size: 13px;
  color: #666;
  text-align: center;
}

.song-actions {
  text-align: right;
}

.like-btn {
  border-radius: 12px;
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
  
  .song-item {
    grid-template-columns: 30px 40px 1fr auto;
    gap: 12px;
    padding: 10px 12px;
  }
  
  .song-stats,
  .song-duration {
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