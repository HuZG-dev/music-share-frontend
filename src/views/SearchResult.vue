<template>
  <div class="search-result-container">
    <!-- 搜索标题和关键词 -->
    <div class="search-header">
      <h1>搜索结果</h1>
      <p class="search-keyword">"{{ keyword }}"</p>
    </div>

    <!-- 标签切换 -->
    <div class="tab-container">
      <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
        <el-tab-pane label="分享" name="shares">
          <!-- 分享结果列表 -->
          <div class="result-list">
            <div v-if="loadingShares" class="loading">
              <el-skeleton :rows="5" animated />
            </div>
            <div v-else-if="shareResults.length === 0" class="empty-result">
              <el-empty description="暂无分享结果" />
            </div>
            <div v-else>
              <share-card 
                v-for="share in shareResults" 
                :key="share.id" 
                :share="share"
                :on-click="goToShareDetail"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="歌曲" name="songs">
          <!-- 歌曲结果列表 -->
          <div class="result-list">
            <div v-if="loadingSongs" class="loading">
              <el-skeleton :rows="5" animated />
            </div>
            <div v-else-if="songResults.length === 0" class="empty-result">
              <el-empty description="暂无歌曲结果" />
            </div>
            <div v-else>
              <div v-for="song in songResults" :key="song.id" class="song-item">
                <div class="song-info">
                  <div class="song-cover">
                    <img :src="song.pic || 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵'" :alt="song.name">
                  </div>
                  <div class="song-details">
                    <h3 class="song-title">{{ song.name }}</h3>
                    <p class="song-artist">{{ song.artist }}</p>
                    <p class="song-album">{{ song.album }}</p>
                  </div>
                </div>
                <div class="song-action">
                  <el-button type="primary" size="small" @click="playSong(song)">
                    <el-icon><VideoPlay /></el-icon> 播放
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElSkeleton, ElEmpty, ElButton, ElTabs, ElTabPane } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import ShareCard from '@/components/ShareCard.vue'
import { searchMusic } from '@/api/netease.js'
import { searchShares } from '@/api/index.js'

const route = useRoute()
const router = useRouter()

// 搜索关键词
const keyword = ref('')

// 激活的标签
const activeTab = ref('shares')

// 分享结果
const shareResults = ref([])
const loadingShares = ref(false)

// 歌曲结果
const songResults = ref([])
const loadingSongs = ref(false)

// 标签切换处理
const handleTabChange = (tabName) => {
  activeTab.value = tabName
}

// 播放歌曲
const playSong = (song) => {
  ElMessage.info(`播放歌曲: ${song.name} - ${song.artist}`)
  // 这里可以添加实际播放逻辑
}

// 跳转到分享详情
const goToShareDetail = (share) => {
  router.push(`/share/${share.id}`)
}

// 搜索分享
const loadShareResults = async () => {
  if (!keyword.value) return
  
  loadingShares.value = true
  try {
    const results = await searchShares(keyword.value)
    shareResults.value = results
    
    // 如果API返回空结果，使用模拟数据
    if (shareResults.value.length === 0) {
      shareResults.value = [
        {
          id: 1,
          title: '推荐一首好听的歌曲',
          content: '这首歌真的很好听，推荐给大家！',
          user: {
            id: 1,
            nickname: '用户1',
            avatar: ''
          },
          music: {
            id: 1,
            name: '歌曲1',
            artist: '歌手1',
            album: '专辑1',
            pic: ''
          },
          likes: 10,
          comments: 5,
          createdAt: '2023-10-01'
        },
        {
          id: 2,
          title: '分享我的歌单',
          content: '这是我最近喜欢的歌单，希望大家喜欢！',
          user: {
            id: 2,
            nickname: '用户2',
            avatar: ''
          },
          music: {
            id: 2,
            name: '歌曲2',
            artist: '歌手2',
            album: '专辑2',
            pic: ''
          },
          likes: 20,
          comments: 10,
          createdAt: '2023-10-02'
        }
      ]
    }
  } catch (error) {
    console.error('搜索分享失败:', error)
    ElMessage.error('搜索分享失败，请重试')
    // 发生错误时使用模拟数据
    shareResults.value = [
      {
        id: 1,
        title: '推荐一首好听的歌曲',
        content: '这首歌真的很好听，推荐给大家！',
        user: {
          id: 1,
          nickname: '用户1',
          avatar: ''
        },
        music: {
          id: 1,
          name: '歌曲1',
          artist: '歌手1',
          album: '专辑1',
          pic: ''
        },
        likes: 10,
        comments: 5,
        createdAt: '2023-10-01'
      },
      {
        id: 2,
        title: '分享我的歌单',
        content: '这是我最近喜欢的歌单，希望大家喜欢！',
        user: {
          id: 2,
          nickname: '用户2',
          avatar: ''
        },
        music: {
          id: 2,
          name: '歌曲2',
          artist: '歌手2',
          album: '专辑2',
          pic: ''
        },
        likes: 20,
        comments: 10,
        createdAt: '2023-10-02'
      }
    ]
  } finally {
    loadingShares.value = false
  }
}

// 搜索歌曲
const loadSongResults = async () => {
  if (!keyword.value) return
  
  loadingSongs.value = true
  try {
    const results = await searchMusic(keyword.value, 20)
    songResults.value = results
  } catch (error) {
    console.error('搜索歌曲失败:', error)
    ElMessage.error('搜索歌曲失败，请重试')
    songResults.value = []
  } finally {
    loadingSongs.value = false
  }
}

// 初始化搜索
onMounted(() => {
  // 获取搜索关键词
  const searchKeyword = route.query.keyword
  if (searchKeyword) {
    keyword.value = searchKeyword
    // 加载搜索结果
    loadShareResults()
    loadSongResults()
  } else {
    // 如果没有关键词，返回首页
    router.push('/')
  }
})
</script>

<style scoped>
.search-result-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  text-align: center;
  margin-bottom: 30px;
}

.search-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.search-keyword {
  font-size: 18px;
  color: #666;
}

.tab-container {
  margin-bottom: 30px;
}

.result-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.song-item:hover {
  background-color: #e6f7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.song-cover {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-details {
  max-width: 300px;
}

.song-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.song-artist {
  font-size: 14px;
  color: #666;
  margin: 0 0 3px 0;
}

.song-album {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.song-action {
  margin-left: auto;
}

.loading {
  grid-column: 1 / -1;
}

.empty-result {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
}

@media (max-width: 768px) {
  .search-result-container {
    padding: 10px;
  }
  
  .search-header h1 {
    font-size: 24px;
  }
  
  .result-list {
    grid-template-columns: 1fr;
  }
  
  .song-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .song-action {
    margin-left: 0;
  }
}
</style>